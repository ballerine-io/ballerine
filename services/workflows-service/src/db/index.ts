import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/env';
import postgres from 'postgres';

const sql = postgres(env.DB_URL);
export const db = drizzle(sql);
