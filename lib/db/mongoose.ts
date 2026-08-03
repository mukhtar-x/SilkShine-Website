import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://user:user@ac-6z3cewn-shard-00-00.eivhr1j.mongodb.net:27017,ac-6z3cewn-shard-00-01.eivhr1j.mongodb.net:27017,ac-6z3cewn-shard-00-02.eivhr1j.mongodb.net:27017/silkshine?ssl=true&replicaSet=atlas-uu6k4h-shard-0&authSource=admin&appName=db';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Global cache to prevent multiple connections in dev mode (hot reload)
declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
