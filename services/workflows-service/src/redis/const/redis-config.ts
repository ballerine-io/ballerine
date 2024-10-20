import { env } from '@/env';
import { RedisOptions } from 'bullmq/dist/esm/interfaces/redis-options';

export const REDIS_CONFIG = {
  host: env.REDIS_HOST || 'localhost',
  port: env.REDIS_PORT || 7381,
  ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
  ...(env.REDIS_DB ? { db: env.REDIS_DB } : {}),
} satisfies RedisOptions;
