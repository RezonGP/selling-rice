import { Worker } from 'bullmq';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
};

export const startOrderWorker = () => {
  // Don't start the worker if Redis is not configured
  if (!env.REDIS_HOST) {
    logger.warn('[BullMQ OrderWorker] Redis not configured — worker disabled.');
    return null;
  }

  try {
    const worker = new Worker(
      'order-processing-queue',
      async (job) => {
        logger.info(`[BullMQ OrderWorker] Processing job ${job.id} for Order #${job.data.orderCode}`);
        return { status: 'COMPLETED', orderCode: job.data.orderCode };
      },
      { connection }
    );

    worker.on('completed', (job) => {
      logger.info(`[BullMQ OrderWorker] Job ${job.id} completed.`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`[BullMQ OrderWorker] Job ${job?.id} failed`, { message: err.message });
    });

    worker.on('error', (err) => {
      // Suppress ECONNREFUSED spam from worker
      if (!err.message?.includes('ECONNREFUSED')) {
        logger.error('[BullMQ OrderWorker] Worker error', { message: err.message });
      }
    });

    return worker;
  } catch (err: any) {
    logger.warn('[BullMQ OrderWorker] Failed to start — Redis offline. Orders will be processed without queue.', {
      message: err.message,
    });
    return null;
  }
};
