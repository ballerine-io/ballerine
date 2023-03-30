#!/usr/bin/node
const childProcess = require('node:child_process');
const path = require('node:path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');
const workflowServiceRoot = path.join(rootDir, 'services/workflows-service');
const backofficeRoot = path.join(rootDir, 'apps/backoffice-v2');

const ensureEnvFileIsPresent = projectPath => {
  const envFile = path.join(projectPath, '.env');
  const envExampleFile = path.join(projectPath, '.env.example');
  if (fs.existsSync(envFile)) {
    return;
  }
  fs.copyFileSync(envExampleFile, envFile);
};

const run = (cmd, cwd = rootDir) => {
  childProcess.execSync(cmd, { cwd, stdio: 'inherit' });
};

// START
console.log('🏗️ preparing project');
run('pnpm run build');

console.log('🍎 preparing environment');
ensureEnvFileIsPresent(backofficeRoot);
ensureEnvFileIsPresent(workflowServiceRoot);

console.log('');
console.log('📈 seeding database');

run('pnpm run docker:db', workflowServiceRoot);
run('pnpm run db:reset:dev', workflowServiceRoot);

console.log('✅ All done!');
console.log('now you can run "pnpm dev"');
