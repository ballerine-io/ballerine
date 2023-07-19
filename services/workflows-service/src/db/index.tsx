import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/env';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const sql = postgres(env.DB_URL, {
  max: 1,
});
export const db = drizzle(sql);

void (async () => {
  await migrate(db, {
    migrationsFolder: './migrations',
  });
})();
