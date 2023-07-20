import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './';
import { resolve } from 'path';

void (async () => {
  await migrate(db, {
    migrationsFolder: resolve(__dirname, './migrations'),
  });

  process.exit(0);
})();
