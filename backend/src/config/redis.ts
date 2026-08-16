import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// Redis is fully optional in local development.
// If Redis is unavailable, the client stays in a disconnected state.
// Rate limiting falls back to MemoryStore; BullMQ queues fail silently.
const createRedisClient = () => {
  const client = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    // Stop retrying after 3 attempts to avoid log spam when Redis is offline
    retryStrategy: (times) => {
      if (times > 3) {
        logger.warn(`[Redis] Offline after ${times} retries — running without Redis (rate limiting uses MemoryStore).`);
        return null; // Stop retrying
      }
      return Math.min(times * 500, 3000);
    },
    maxRetriesPerRequest: null,
    // Do NOT crash the process on Redis connection failure
    enableOfflineQueue: false,
    lazyConnect: true,
  });

  client.on('connect', () => {
    logger.info(`[Redis] Connected to ${env.REDIS_HOST}:${env.REDIS_PORT}`);
  });

  client.on('ready', () => {
    logger.info('[Redis] Ready to accept commands.');
  });

  client.on('error', (err) => {
    // Only log ECONNREFUSED once, not repeatedly
    if (err.message?.includes('ECONNREFUSED') && (client as any).__econnLogged) return;
    if (err.message?.includes('ECONNREFUSED')) {
      (client as any).__econnLogged = true;
      logger.warn('[Redis] Not available (ECONNREFUSED) — app will run without Redis caching.');
    } else {
      logger.error('[Redis] Client Error', { message: err.message });
    }
  });

  // Attempt connection in background — never block startup
  client.connect().catch(() => {
    // Silently ignored — retryStrategy handles logging
  });

  return client;
};

export const redisClient = createRedisClient();

// Helper: check if Redis is usable right now
export const isRedisReady = (): boolean => redisClient.status === 'ready';
