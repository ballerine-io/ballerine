import dotenv from 'dotenv';
import { execSync } from 'child_process';

async function main() {
  try {
    dotenv.config();
  } catch (error) {
    console.error('Failed to load .env file:', error);
    process.exit(1);
  }

  try {
    await uploadSourceMaps();
  } catch (error) {
    console.error('Failed to upload source maps:', error);
    process.exit(1);
  }
}

async function uploadSourceMaps() {
  if (!process.env.SENTRY_AUTH_TOKEN) {
    console.log('SENTRY_AUTH_TOKEN not provided. Skipping source maps upload.');
    return;
  }

  try {
    execSync('sentry-cli sourcemaps upload ./dist', { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to upload source maps: ${error.message}`);
  }
}

if (require.main === module) {
  main();
}
