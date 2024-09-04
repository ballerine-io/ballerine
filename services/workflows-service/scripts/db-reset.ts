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

  console.info('Running Prisma migrate reset...');
  execSync('prisma migrate reset --skip-seed -f', { stdio: 'inherit' });

  console.info('Reset completed successfully');
}
