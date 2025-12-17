import mongoose from "mongoose";

const MONGODB_URI = mongodb+srv://mdnajmullhassan938_db_user:6AKUSUHjhnjfJ1zj@trust-market.7xzf3xj.mongodb.net/trust_market;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
