#!/usr/bin/node
const childProcess = require('node:child_process');
const path = require('node:path');
const fs = require('fs');
const rootDir = path.join(__dirname, '..');
const run = (cmd, cwd = rootDir) => {
  childProcess.execSync(cmd, { cwd, stdio: 'inherit' });
};

console.warn(rootDir);

console.log('🏗️ preparing project');
run('pnpm run build');

console.log('🍎 preparing environment');

const mandatoryBackofficeEnvFile = path.join(rootDir, 'apps/backoffice-v2/.env');
if (!fs.existsSync(mandatoryBackofficeEnvFile)) {
  fs.copyFileSync(
    path.join(rootDir, 'apps/backoffice-v2/.env.example'),
    mandatoryBackofficeEnvFile,
  );
}

const workflowServiceRoot = path.join(rootDir, 'services/workflows-service');
const mandatoryServicesEnvFile = path.join(workflowServiceRoot, '.env');
if (!fs.existsSync(mandatoryServicesEnvFile)) {
  fs.copyFileSync(path.join(workflowServiceRoot, '.env.example'), mandatoryServicesEnvFile);
}

console.log('');
console.log('📈 seeding database');

run('pnpm run docker:db', workflowServiceRoot);
run('pnpm run db:reset:dev', workflowServiceRoot);

console.log('✔ starting project');
run('pnpm run kyc-manual-review-example');
