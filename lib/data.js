import 'server-only';
import { unstable_cache } from 'next/cache';
import { connectDB, serialize } from './db';
import About from './models/About';
import Project from './models/Project';
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
};

const cached = (fn, tag) => unstable_cache(fn, [tag], { tags: [tag], revalidate: 3600 });

export const getAbout = cached(async () => {
  await connectDB();
  const about = await About.findOne().lean();
  return about ? serialize(about) : {};
}, TAGS.about);

export const getProjects = cached(async () => {
  await connectDB();
  return serialize(await Project.find().sort({ order: 1, createdAt: -1 }).lean());
}, TAGS.projects);

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
