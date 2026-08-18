import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDB = async (): Promise<typeof mongoose | null> => {
  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 3000,
    });
    logger.info(`[MongoDB] Connected → ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    logger.warn('[MongoDB] MongoDB disabled/not reachable. Running in Pure MySQL mode.', { message: error.message });
    return null;
  }
};
