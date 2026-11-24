import mongoose from 'mongoose';
import { defineModel } from './defineModel';

// Tabs for the Projects and Certifications sections (e.g. "Development", "Cloud").
// `scope` says which section a category belongs to. Items store the category's
// `key`, which never changes, so renaming a category doesn't break them.
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  scope: { type: String, enum: ['project', 'certification'], default: 'project', index: true },
  order: { type: Number },
}, { timestamps: true });

// Model name kept as "ProjectCategory" so the existing collection keeps being used.
export default defineModel('ProjectCategory', CategorySchema);
