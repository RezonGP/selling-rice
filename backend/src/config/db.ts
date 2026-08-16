import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDB = async (): Promise<typeof mongoose> => {
  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });
    logger.info(`[MongoDB] Connected → ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    logger.error('[MongoDB] Connection failed', { message: error.message });
    process.exit(1);
  }
};
