import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // cover screenshot – Cloudinary URL (legacy: Base64)
  gallery: { type: [String], default: [] }, // extra screenshots shown in the slideshow
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  tech: { type: [String], default: [] },
  order: { type: Number }, // position chosen in the admin (lower = first)
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
