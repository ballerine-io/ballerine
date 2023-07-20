import type { Config } from 'drizzle-kit';
import { env } from '@/env';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  strict: true,
  verbose: true,
  dbCredentials: {
    connectionString: env.DB_URL,
  },
} satisfies Config;
