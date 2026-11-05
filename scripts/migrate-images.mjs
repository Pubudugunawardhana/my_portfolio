// Move Base64 images/files stored in MongoDB to Cloudinary and save the URLs instead.
// Usage:
//   npm run migrate-images -- --dry-run   # list what would be migrated, change nothing
//   npm run migrate-images                # upload + update the database
// Original values are written to scripts/backups/ before anything is changed.
import { mkdir, writeFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const DRY_RUN = process.argv.includes('--dry-run');
const FOLDER = 'portfolio';

// collection → fields that may hold a Base64 data URI
const TARGETS = {
  abouts: ['profileImage', 'coverImage', 'resumeFile'],
  projects: ['image', 'gallery'],
  certifications: ['image'],
};

const isDataUri = (v) => typeof v === 'string' && v.startsWith('data:');
const kb = (s) => `${Math.round(s.length / 1024)} KB`;

const required = ['MONGODB_URI', ...(DRY_RUN ? [] : ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'])];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')} (add them to .env.local)`);
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function upload(dataUri, publicId) {
  // PDFs (the CV) go up as "raw" so Cloudinary serves them as a normal download.
  const isImage = dataUri.startsWith('data:image/');
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER,
    public_id: publicId,
    resource_type: isImage ? 'image' : 'raw',
    overwrite: true,
  });
  return res.secure_url;
}

await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
const db = mongoose.connection.db;
const backup = [];
let migrated = 0;
let failed = 0;

try {
  for (const [collection, fields] of Object.entries(TARGETS)) {
    const docs = await db.collection(collection).find().toArray();
    for (const doc of docs) {
      const label = (doc.title || doc.name || collection).slice(0, 40);
      const update = {};

      for (const field of fields) {
        const value = doc[field];
        const values = Array.isArray(value) ? value : [value];
        if (!values.some(isDataUri)) continue;

        const next = [];
        for (const [i, v] of values.entries()) {
          if (!isDataUri(v)) {
            next.push(v);
            continue;
          }
          const publicId = `${collection}-${doc._id}-${field}${Array.isArray(value) ? `-${i}` : ''}`;
          if (DRY_RUN) {
            console.log(`• ${collection} / ${label} / ${field}: ${kb(v)} → would upload as ${FOLDER}/${publicId}`);
            next.push(v);
            continue;
          }
          try {
            const url = await upload(v, publicId);
            console.log(`✅ ${collection} / ${label} / ${field}: ${kb(v)} → ${url}`);
            next.push(url);
            migrated++;
          } catch (err) {
            console.error(`❌ ${collection} / ${label} / ${field}: ${err.message}`);
            next.push(v); // keep the original so nothing is lost
            failed++;
          }
        }
        update[field] = Array.isArray(value) ? next : next[0];
      }

      if (!DRY_RUN && Object.keys(update).length) {
        backup.push({ collection, _id: String(doc._id), original: Object.fromEntries(Object.keys(update).map((f) => [f, doc[f]])) });
        await db.collection(collection).updateOne({ _id: doc._id }, { $set: update });
      }
    }
  }

  if (backup.length) {
    await mkdir(new URL('./backups/', import.meta.url), { recursive: true });
    const file = new URL(`./backups/images-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, import.meta.url);
    await writeFile(file, JSON.stringify(backup));
    console.log(`\nBackup of original values: ${file.pathname}`);
  }
  console.log(DRY_RUN ? '\nDry run finished – nothing was changed.' : `\nDone: ${migrated} migrated, ${failed} failed.`);
} finally {
  await mongoose.disconnect();
}
