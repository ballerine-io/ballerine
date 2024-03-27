import { PostgreSqlContainer } from '@testcontainers/postgresql';

import console from 'console';
import { TestGlobal } from '@/test/test-global';
import { execSync } from 'child_process';

const DATANASE_NAME = 'test';

module.exports = async () => {
  if (process.env.SKIP_DB_SETUP_TEARDOWN) return;

  const container = await new PostgreSqlContainer('sibedge/postgres-plv8:15.6-3.2.2')
    .withDatabase(DATANASE_NAME)
    .withExposedPorts({ host: 5444, container: 5432 })
    .start();

  process.env.TEST_DATABASE_SCHEMA_NAME = container.getDatabase();
  process.env.DB_URL = container.getConnectionUri();

  console.log('\nStarting database container on: ' + process.env.DB_URL);

  runPrismaMigrations();

  (globalThis as TestGlobal).__DB_CONTAINER__ = container;
};

const runPrismaMigrations = () => {
  if (process.env.SKIP_DB_SETUP_TEARDOWN) return;

  try {
    execSync('npx prisma migrate dev --preview-feature', { stdio: 'inherit' });
  } catch (error) {
    console.error('Prisma migration failed:');
    console.error(error);
  }
};
