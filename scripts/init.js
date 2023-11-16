#!/usr/bin/node
const childProcess = require('node:child_process');
const path = require('node:path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

const ensureEnvFileIsPresent = projectPath => {
  const envFile = path.join(projectPath, '.env');
  const envExampleFile = path.join(projectPath, '.env.example');
  if (fs.existsSync(envFile)) {
    const destPath = `${envFile}-${new Date().toISOString().replace(/,|:|\s/g, '-')}.backup`;
    fs.copyFileSync(envFile, destPath);
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

const directories = [
  'services/workflows-service',
  'services/websocket-service',
  'apps/backoffice-v2',
  'apps/workflows-dashboard',
];

directories.forEach(directory => {
  ensureEnvFileIsPresent(path.join(rootDir, directory));
});

console.log('✅ All done!');
