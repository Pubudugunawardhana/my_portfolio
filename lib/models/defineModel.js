import mongoose from 'mongoose';

// Reuse a compiled model across hot reloads, but replace it when its schema has
// changed (e.g. a new field): a stale model silently drops unknown fields on save.
export function defineModel(name, schema) {
  const existing = mongoose.models[name];
  if (existing) {
    const same = Object.keys(schema.paths).every((path) => existing.schema.path(path));
    if (same) return existing;
    mongoose.deleteModel(name);
  }
  return mongoose.model(name, schema);
}
