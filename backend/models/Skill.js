const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tech: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
