import 'server-only';
import { unstable_cache } from 'next/cache';
import { connectDB, serialize } from './db';
import About from './models/About';
import Project from './models/Project';
import ProjectCategory from './models/ProjectCategory';
import Skill from './models/Skill';
import Certification from './models/Certification';
import Message from './models/Message';
import Analytics from './models/Analytics';

// Public content is cached and tagged; admin Server Actions call updateTag(tag)
// after a write, so visitors never poll and edits show up immediately.
export const TAGS = {
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  certifications: 'certifications',
  projectCategories: 'project-categories',
  certificationCategories: 'certification-categories',
};

// Created the first time a section's categories are read. The project keys match
// the values projects were saved with before categories were editable.
const DEFAULT_CATEGORIES = {
  project: [
    { key: 'development', name: 'Development', order: 0 },
    { key: 'qa', name: 'QA Automation', order: 1 },
  ],
  certification: [{ key: 'cert-general', name: 'General', order: 0 }],
};

// Bump when the shape of cached data changes, so stale entries (which survive
// restarts and, on Vercel, deployments) are ignored instead of served for an hour.
const CACHE_VERSION = 'v2';

const cached = (fn, tag) => unstable_cache(fn, [tag, CACHE_VERSION], { tags: [tag], revalidate: 3600 });

export const getAbout = cached(async () => {
  await connectDB();
  const about = await About.findOne().lean();
  return about ? serialize(about) : {};
}, TAGS.about);

export const getProjects = cached(async () => {
  await connectDB();
  return serialize(await Project.find().sort({ order: 1, createdAt: -1 }).lean());
}, TAGS.projects);

async function loadCategories(scope) {
  await connectDB();
  // Categories made before scopes existed all belong to projects.
  await ProjectCategory.updateMany({ scope: { $exists: false } }, { $set: { scope: 'project' } });
  if (!(await ProjectCategory.exists({ scope }))) {
    await ProjectCategory.bulkWrite(
      DEFAULT_CATEGORIES[scope].map((c) => ({
        updateOne: { filter: { key: c.key }, update: { $setOnInsert: { ...c, scope } }, upsert: true },
      }))
    );
  }
  return serialize(await ProjectCategory.find({ scope }).sort({ order: 1, createdAt: 1 }).lean());
}

export const getProjectCategories = cached(() => loadCategories('project'), TAGS.projectCategories);
export const getCertificationCategories = cached(() => loadCategories('certification'), TAGS.certificationCategories);

export const getSkills = cached(async () => {
  await connectDB();
  return serialize(await Skill.find().sort({ order: 1, createdAt: 1 }).lean());
}, TAGS.skills);

export const getCertifications = cached(async () => {
  await connectDB();
  return serialize(await Certification.find().sort({ order: 1, createdAt: -1 }).lean());
}, TAGS.certifications);

// Admin-only data is always read fresh.
export async function getMessages() {
  await connectDB();
  return serialize(await Message.find().sort({ createdAt: -1 }).lean());
}

export async function getDailyViews() {
  await connectDB();
  const stats = await Analytics.find().sort({ date: 1 }).lean();
  return Object.fromEntries(stats.map((s) => [s.date, s.views]));
}

// Run a loader but fall back to a default when the DB is unreachable,
// so one failing section never takes the whole page down.
export async function safe(loader, fallback) {
  try {
    return await loader();
  } catch (err) {
    console.error('Data load failed:', err.message);
    return fallback;
  }
}
