import { db } from '@/db/index';
import { sql } from 'drizzle-orm';
import * as process from 'process';

const getTables = async () =>
  db.execute(sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public';
  `);
const getTypes = async () =>
  db.execute(sql`
    SELECT t.typname
    FROM pg_type t
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public';
  `);
const dropTable = async (table: string) =>
  db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE;`));
const dropType = async (type: string) =>
  db.execute(sql.raw(`DROP TYPE IF EXISTS "${type}" CASCADE;`));

void (async () => {
  const tables = await getTables();
  const types = await getTypes();

  await Promise.allSettled(
    // @ts-ignore
    tables.map(table => dropTable(table.tablename)),
  );
  await Promise.allSettled(
    // @ts-ignore
    types.map(type => dropType(type.typname)),
  );

  process.exit(0);
})();
