import mongoose from 'mongoose';
import { defineModel } from './defineModel';

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String }, // Cloudinary URL (legacy: Base64)
  credentialUrl: { type: String, default: '' },
  pdfUrl: { type: String, default: '' }, // original certificate PDF, when uploaded as a PDF
  category: { type: String }, // key of a certification category (see lib/data.js)
  order: { type: Number }, // position chosen in the admin (lower = first)
}, { timestamps: true });

export default defineModel('Certification', CertificationSchema);
