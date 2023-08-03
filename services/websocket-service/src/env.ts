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
    COMPOSE_PROJECT_NAME: z.string(),
    PORT: z.coerce.number(),
  },
  client: {},
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: process.env,
  skipValidation: !!process.env.CI,
});
