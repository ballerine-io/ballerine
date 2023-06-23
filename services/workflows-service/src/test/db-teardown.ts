import { TestGlobal } from '@/test/test-global';

export async function teardown() {
  const globalThisTest = globalThis as TestGlobal;

  if (!globalThisTest.__DB_CONTAINER__) return;

  await globalThisTest.__DB_CONTAINER__.stop();
}

module.exports = teardown;
