import { Queue } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { isRedisReady } from '../config/redis';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
};

// Lazy queue factory: returns a real Queue if Redis is ready, or a no-op stub if offline
const createOptionalQueue = (name: string) => {
  // Return a proxy that silently no-ops when Redis is unavailable
  const stub = {
    add: async (_jobName: string, _data: any) => {
      logger.debug(`[Queue:${name}] Redis offline — skipping job "${_jobName}"`);
      return null;
    },
  };

  try {
    const queue = new Queue(name, { connection });
    return queue;
  } catch (err) {
    logger.warn(`[Queue:${name}] Could not initialize BullMQ queue — Redis offline.`);
    return stub as unknown as Queue;
  }
};

export const orderQueue = createOptionalQueue('order-processing-queue');
export const emailQueue = createOptionalQueue('email-notification-queue');
