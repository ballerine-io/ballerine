import { PostgreSqlContainer } from 'testcontainers';
import console from 'console';
import { TestGlobal } from '@/test/test-global';
import { execSync } from 'child_process';

module.exports = async () => {
  if (process.env.SKIP_DB_SETUP_TEARDOWN) return;

  const container = await new PostgreSqlContainer('sibedge/postgres-plv8:15.3-3.1.7')
    .withDatabase('test')
    .start();
  process.env.TEST_DATABASE_SCHEMA_NAME = container.getDatabase();
  process.env.DB_URL = container.getConnectionUri();
  console.log('\nStarting database container on: ' + container.getConnectionUri());

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
