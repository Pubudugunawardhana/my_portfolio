'use server';

import { updateTag, revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/auth';
import { connectDB } from '@/lib/db';
import { TAGS } from '@/lib/data';
import About from '@/lib/models/About';
import Project from '@/lib/models/Project';
import Skill from '@/lib/models/Skill';
import Certification from '@/lib/models/Certification';
import Message from '@/lib/models/Message';

// Optional fields have no defaults: a field the form doesn't send is left
// untouched in the database instead of being wiped (e.g. an unchanged image).
const optionalUrl = z.union([z.literal(''), z.url()]).optional();
const text = (max) => z.string().trim().max(max).optional();
const techList = z
  .union([z.array(z.string()), z.string()])
  .transform((v) => (Array.isArray(v) ? v : v.split(',')).map((t) => t.trim()).filter(Boolean));

const schemas = {
  about: z.object({
    name: text(100), role: text(100), location: text(100), email: z.union([z.literal(''), z.email()]).optional(),
    shortBio: text(300), longBio: text(5000), school: text(200), university: text(200),
    github: optionalUrl, linkedin: optionalUrl, medium: optionalUrl,
    profileImage: optionalUrl, coverImage: optionalUrl, resumeFile: optionalUrl,
  }).partial(),
  project: z.object({
    title: z.string().trim().min(1, 'Title is required').max(150),
    description: z.string().trim().min(1, 'Description is required').max(5000),
    image: optionalUrl, githubUrl: optionalUrl, liveUrl: optionalUrl, tech: techList,
    gallery: z.array(z.url()).max(3, 'Up to 3 extra screenshots').optional(),
  }),
  skill: z.object({
    name: z.string().trim().min(1, 'Category name is required').max(100),
    tech: techList,
  }),
  certification: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    issuer: z.string().trim().min(1, 'Issuer is required').max(200),
    date: z.string().trim().min(1, 'Date is required').max(50),
    description: text(2000), image: optionalUrl, credentialUrl: optionalUrl,
  }),
};

// Every action returns { ok } or { ok: false, error } so forms can show feedback.
async function run(fn) {
  try {
    await requireAdmin();
    await connectDB();
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    if (err instanceof z.ZodError) return { ok: false, error: err.issues[0]?.message ?? 'Invalid input' };
    console.error(err);
    return { ok: false, error: err.message === 'Unauthorized' ? 'Your session expired. Please sign in again.' : 'Something went wrong. Please try again.' };
  }
}

function refresh(tag) {
  updateTag(tag);
  revalidatePath('/admin', 'layout');
}

/* About / Profile */
export async function saveAbout(input) {
  return run(async () => {
    const data = schemas.about.parse(input);
    await About.findOneAndUpdate({}, { $set: data }, { upsert: true });
    refresh(TAGS.about);
  });
}

/* Generic CRUD for list-style collections */
const collections = {
  project: { model: Project, tag: TAGS.projects },
  skill: { model: Skill, tag: TAGS.skills },
  certification: { model: Certification, tag: TAGS.certifications },
};

export async function saveItem(kind, id, input) {
  return run(async () => {
    if (!collections[kind]) throw new Error(`Unknown type: ${kind}`);
    const { model, tag } = collections[kind];
    const data = schemas[kind].parse(input);
    if (id) {
      await model.findByIdAndUpdate(id, data, { runValidators: true });
    } else {
      // New items go to the top of the list.
      const first = await model.findOne({ order: { $ne: null } }).sort({ order: 1 }).select('order').lean();
      await model.create({ ...data, order: (first?.order ?? 0) - 1 });
    }
    refresh(tag);
  });
}

// Save a new display order: ids[0] is shown first.
export async function reorderItems(kind, ids) {
  return run(async () => {
    if (!collections[kind]) throw new Error(`Unknown type: ${kind}`);
    const parsed = z.array(z.string().regex(/^[a-f0-9]{24}$/i)).max(500).parse(ids);
    const { model, tag } = collections[kind];
    await model.bulkWrite(parsed.map((_id, order) => ({ updateOne: { filter: { _id }, update: { $set: { order } } } })));
    refresh(tag);
  });
}

export async function deleteItem(kind, id) {
  return run(async () => {
    if (!collections[kind]) throw new Error(`Unknown type: ${kind}`);
    const { model, tag } = collections[kind];
    await model.findByIdAndDelete(id);
    refresh(tag);
  });
}

/* Messages */
export async function setMessageRead(id, read) {
  return run(async () => {
    await Message.findByIdAndUpdate(id, { read });
    revalidatePath('/admin', 'layout');
  });
}

export async function deleteMessage(id) {
  return run(async () => {
    await Message.findByIdAndDelete(id);
    revalidatePath('/admin', 'layout');
  });
}
