import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

let retryCount = 0;

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    retryCount = 0;
  } catch (error) {
    retryCount += 1;
    const err = error as Error;
    console.error(`❌ MongoDB connection error (attempt ${retryCount}/${MAX_RETRIES}): ${err.message}`);

    if (retryCount >= MAX_RETRIES) {
      console.error('💀 Max DB connection retries reached. Exiting.');
      process.exit(1);
    }

    console.log(`🔄 Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_INTERVAL_MS);
  }
};

mongoose.connection.on('disconnected', () => {
  if (env.NODE_ENV !== 'test') {
    console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
    setTimeout(connectDB, RETRY_INTERVAL_MS);
  }
});

export default connectDB;
