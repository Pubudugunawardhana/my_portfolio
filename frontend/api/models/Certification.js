const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String }, // Base64 or URL
  link: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);
