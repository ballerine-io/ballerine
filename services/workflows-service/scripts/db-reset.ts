import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as process from 'node:process';
import { execSync } from 'child_process';

if (require.main === module) {
  dotenv.config();
  dbReset().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

async function dbReset() {
  if (process.env.DB_URL?.includes('rds.amazonaws.com')) {
    console.error('This script is not intended to be used in cloud');
    process.exit(1);
  }

  console.info('Resetting and seeding the database...');

  // Run Prisma migrate reset
  console.info('Running Prisma migrate reset...');
  execSync('prisma migrate reset --skip-seed -f', { stdio: 'inherit' });

  // Run seed script
  console.info('Running seed script...');
  execSync('npm run seed', { stdio: 'inherit' });

  console.info('Reset and seed completed successfully');
}
