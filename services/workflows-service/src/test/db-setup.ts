import { PostgreSqlContainer } from 'testcontainers';
import console from 'console';
import { TestGlobal } from '@/test/test-global';
import { execSync } from 'child_process';
import os from "os";

module.exports = async () => {
  if (os.platform() === 'win32') {
    return await setupLocalTestOnWindowsBase();
  }
  await setupTestContainersOnLinuxBase();
};
function setupLocalTestOnWindowsBase() {
  process.env.TEST_DATABASE_SCHEMA_NAME = 'test';
  process.env.DB_URL = 'postgresql://test:test@localhost:5432/test';

  runPrismaMigrations();
}

const setupTestContainersOnLinuxBase = async () => {
  const container = await new PostgreSqlContainer().withDatabase('test').start();
  process.env.TEST_DATABASE_SCHEMA_NAME = container.getDatabase();
  process.env.DB_URL = container.getConnectionUri();
  console.log('\nStarting database container on: ' + container.getConnectionUri());

  runPrismaMigrations();

  (globalThis as TestGlobal).__DB_CONTAINER__ = container;
}

const runPrismaMigrations = () => {
  try {
    execSync('npx prisma migrate dev --preview-feature', { stdio: 'inherit' });
  } catch (error) {
    console.error('Prisma migration failed:');
    console.error(error);
  }
};
