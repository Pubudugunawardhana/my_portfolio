import mongoose from 'mongoose';

// Tabs for the Projects and Certifications sections (e.g. "Development", "Cloud").
// `scope` says which section a category belongs to. Items store the category's
// `key`, which never changes, so renaming a category doesn't break them.
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  scope: { type: String, enum: ['project', 'certification'], default: 'project', index: true },
  order: { type: Number },
}, { timestamps: true });

// In dev, hot reload can keep a model compiled from an older schema (one without
// `scope`), which would silently drop the field on save – replace it.
if (mongoose.models.ProjectCategory && !mongoose.models.ProjectCategory.schema.path('scope')) {
  mongoose.deleteModel('ProjectCategory');
}

// Model name kept as "ProjectCategory" so the existing collection keeps being used.
export default mongoose.models.ProjectCategory || mongoose.model('ProjectCategory', CategorySchema);
