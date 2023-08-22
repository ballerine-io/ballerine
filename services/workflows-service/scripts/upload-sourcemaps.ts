import * as dotenv from 'dotenv';
import * as child_process from 'child_process';

if (require.main === module) {
  dotenv.config();

  uploadSourceMaps().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

async function uploadSourceMaps() {
  return new Promise<void>((resolve, reject) => {
    if (!process.env.SENTRY_AUTH_TOKEN) {
      return resolve();
    }

    try {
      child_process.execSync('sentry-cli sourcemaps upload ./dist', { stdio: 'inherit' });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
