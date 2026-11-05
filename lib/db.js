import mongoose from 'mongoose';

// Cache the connection across hot reloads and serverless invocations.
// A failed attempt is cleared so the next request retries instead of staying broken.
const cached = globalThis._mongoose ?? (globalThis._mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Convert lean Mongoose docs into plain JSON-safe objects for Client Components.
export function serialize(doc) {
  return JSON.parse(JSON.stringify(doc, (key, value) => (key === '__v' ? undefined : value)));
}
