#!/usr/bin/node
const childProcess = require('node:child_process');
const path = require('node:path');

const rootDir = path.join(__dirname, '..');
const workflowServiceRoot = path.join(rootDir, 'services/workflows-service');

const run = (cmd, cwd = rootDir) => {
  childProcess.execSync(cmd, { cwd, stdio: 'inherit' });
};

// START
console.log('🏗️ preparing project');
run('pnpm run db:reset', workflowServiceRoot);
run(`ts-node scripts/${process.env.SEED_FILENAME}.ts`, workflowServiceRoot);

console.log('✅ All done!');
