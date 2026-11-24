import mongoose from 'mongoose';
import { defineModel } from './defineModel';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tech: [{ type: String }],
  order: { type: Number }, // position chosen in the admin (lower = first)
}, { timestamps: true });

export default defineModel('Skill', SkillSchema);
