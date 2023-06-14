#!/usr/bin/node
const childProcess = require('node:child_process');
const path = require('node:path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');
const workflowServiceRoot = path.join(rootDir, 'services/workflows-service');
const workflowWebsocketServiceRoot = path.join(rootDir, 'services/workflows-websocket-service');
const backofficeRoot = path.join(rootDir, 'apps/backoffice-v2');

const ensureEnvFileIsPresent = projectPath => {
  const envFile = path.join(projectPath, '.env');
  const envExampleFile = path.join(projectPath, '.env.example');
  if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, `${envFile}-${new Date().toISOString()}.backup`);
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
ensureEnvFileIsPresent(workflowWebsocketServiceRoot);

console.log('✅ All done!');
