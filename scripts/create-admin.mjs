// Create the admin user, or reset its password if it already exists.
// Usage: npm run create-admin
// The email must also be listed in ADMIN_EMAILS to be allowed into /admin.
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MIN_LENGTH = 10;

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set (add it to .env or .env.local).');
  process.exit(1);
}

const rl = createInterface({ input, output });
const defaultEmail = (process.env.ADMIN_EMAILS || '').split(',')[0]?.trim();
const email = ((await rl.question(`Admin email${defaultEmail ? ` (${defaultEmail})` : ''}: `)) || defaultEmail).trim().toLowerCase();
const password = await rl.question(`New password (min ${MIN_LENGTH} characters): `);
rl.close();

if (!email || !email.includes('@')) {
  console.error('A valid email is required.');
  process.exit(1);
}
if (password.length < MIN_LENGTH) {
  console.error(`Password must be at least ${MIN_LENGTH} characters.`);
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const users = mongoose.connection.db.collection('users');
  const hashed = await bcrypt.hash(password, 10);
  const result = await users.updateOne(
    { email },
    { $set: { password: hashed, updatedAt: new Date() }, $setOnInsert: { email, createdAt: new Date() } },
    { upsert: true }
  );
  console.log(result.upsertedCount ? `✅ Admin user created: ${email}` : `✅ Password updated for: ${email}`);

  const allowed = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map((e) => e.trim());
  if (!allowed.includes(email)) console.warn(`⚠️  Add ${email} to ADMIN_EMAILS or sign-in will be refused.`);
} catch (err) {
  console.error('❌ Failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
