import { env } from '@/env';

export const REDIS_CONFIG = {
  password: env.REDIS_PASSWORD || 'password',
  host: env.REDIS_HOST || 'localhost',
  port: env.REDIS_PORT || 7381,
};
