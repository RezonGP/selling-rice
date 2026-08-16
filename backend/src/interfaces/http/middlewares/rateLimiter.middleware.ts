import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient, isRedisReady } from '../../../config/redis';
import { logger } from '../../../config/logger';

// Build RedisStore only when Redis is actually ready, otherwise fall back to MemoryStore
const buildStore = (prefix: string) => {
  if (isRedisReady()) {
    try {
      return new RedisStore({
        // @ts-ignore
        sendCommand: (...args: string[]) => redisClient.call(...args),
        prefix,
      });
    } catch (err) {
      logger.warn(`[RateLimiter] Failed to create RedisStore for "${prefix}" — using MemoryStore.`);
    }
  }
  return undefined; // undefined → express-rate-limit uses built-in MemoryStore
};

export const publicApiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  // Store is evaluated lazily per request via a getter
  get store() { return buildStore('rl:public:'); },
});

export const authLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  get store() { return buildStore('rl:auth:'); },
});
