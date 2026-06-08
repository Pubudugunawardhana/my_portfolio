const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String }, // Base64 or URL
  credentialUrl: { type: String, default: '' } // Changed from 'link' to 'credentialUrl' for consistency with frontend
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);
