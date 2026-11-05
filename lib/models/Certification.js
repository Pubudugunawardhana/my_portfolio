import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String }, // Cloudinary URL (legacy: Base64)
  credentialUrl: { type: String, default: '' },
  order: { type: Number }, // position chosen in the admin (lower = first)
}, { timestamps: true });

export default mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
