import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  /*
   * clientPrefix is required.
   */
  clientPrefix: 'PUBLIC_',
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
    ENV_FILE_NAME: z.string().optional(),
    BCRYPT_SALT: z.coerce.number().int().nonnegative().or(z.string()),
    COMPOSE_PROJECT_NAME: z.string(),
    JWT_SECRET_KEY: z.string(),
    JWT_EXPIRATION: z.string(),
    PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number(),
    DB_URL: z.string().url(),
    SESSION_SECRET: z.string(),
    BACKOFFICE_CORS_ORIGIN: z.string().url(),
    HEADLESS_EXAMPLE_CORS_ORIGIN: z.string().url(),
    AWS_S3_BUCKET_NAME: z.string().optional(),
    AWS_S3_BUCKET_KEY: z.string().optional(),
    AWS_S3_BUCKET_SECRET: z.string().optional(),
    API_KEY: z.string(),
    SENTRY_DSN: z.string().nullable().optional(),
  },
  client: {},
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: process.env,
  skipValidation: !!process.env.CI,
});
