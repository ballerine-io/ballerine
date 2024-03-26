import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

async function main() {
  try {
    dotenv.config();
    await clean();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function clean() {
  console.info('Dropping all tables in the database...');
  const prisma = new PrismaClient();
  try {
    const [tables, types] = await Promise.all([getTables(prisma), getTypes(prisma)]);
    await Promise.all([
      ...tables.map(table => dropTable(prisma, table)),
      ...types.map(type => dropType(prisma, type)),
    ]);
    console.info('Cleaned database successfully');
  } catch (error) {
    console.error('Failed to clean database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function dropTable(prisma: PrismaClient, table: string): Promise<void> {
  await prisma.$executeRawUnsafe(`DROP TABLE public."${table}" CASCADE;`);
}

async function dropType(prisma: PrismaClient, type: string): Promise<void> {
  await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "${type}" CASCADE;`);
}

async function getTables(prisma: PrismaClient): Promise<string[]> {
  const results: Array<{
    tablename: string;
  }> = await prisma.$queryRaw`SELECT tablename from pg_tables where schemaname = 'public';`;
  return results.map(result => result.tablename);
}

async function getTypes(prisma: PrismaClient): Promise<string[]> {
  const results: Array<{
    typname: string;
  }> = await prisma.$queryRaw`
 SELECT t.typname
 FROM pg_type t
 JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
 WHERE n.nspname = 'public';
 `;
  return results.map(result => result.typname);
}

if (require.main === module) {
  main();
}
