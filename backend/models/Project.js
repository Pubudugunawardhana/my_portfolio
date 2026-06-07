const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Base64 or URL
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  tech: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
