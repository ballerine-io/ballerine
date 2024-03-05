import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const databaseHelper = new PrismaClient();
// should never be unset - default test in order not to delete default db
const TEST_DATABASE_SCHEMA_NAME = z
  .string()
  .default('test')
  .parse(process.env.DATABASE_SCHEMA_NAME);

const __getTables = async (prisma: PrismaClient): Promise<string[]> => {
  const results: Array<{
    tablename: string;
  }> =
    await prisma.$queryRaw`SELECT tablename from pg_tables where schemaname = '${TEST_DATABASE_SCHEMA_NAME}';`;

  return results.map(result => result.tablename);
};

const __removeAllTableContent = async (prisma: PrismaClient, tableNames: string[]) => {
  for (const table of tableNames) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${TEST_DATABASE_SCHEMA_NAME}."${table}" CASCADE;`);
  }
};

//should be implemented in BeforeEach hook
export const cleanupDatabase = async () => {
  const tableNames = await __getTables(databaseHelper);
  await __removeAllTableContent(databaseHelper, tableNames);
};

//should be implemented in AfterEach hook
export const tearDownDatabase = async () => {
  await databaseHelper.$disconnect();
};
