#!/usr/bin/env node

const inquirer = require('inquirer').default;
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const getPackageJson = (folderPath, servicePath) => {
  const packageJsonPath = path.join(__dirname, '..', folderPath, servicePath, 'package.json');
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
};

const getStartCommand = packageJson => {
  if (packageJson.scripts && packageJson.scripts['start:dev']) {
    return 'pnpm start:dev';
  }
  if (packageJson.scripts && packageJson.scripts.start) {
    return 'pnpm start';
  }
  return null;
};

const servicesAndApps = [
  { folder: 'services', items: ['workflows-service'] },
  { folder: 'apps', items: ['workflows-dashboard', 'kyb-app', 'backoffice-v2'] },
].flatMap(({ folder, items }) =>
  items.map(servicePath => {
    const packageJson = getPackageJson(folder, servicePath);
    const command = getStartCommand(packageJson);
    return {
      name: packageJson.name || servicePath,
      value: `${folder}/${servicePath}`,
      command: command || `echo "No start command found for ${servicePath}"`,
    };
  }),
);

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

async function main() {
  const { selectedItems } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedItems',
      message: 'Select services and apps to run:',
      choices: servicesAndApps,
      default: servicesAndApps.map(item => item.value), // Select all by default
    },
  ]);

  selectedItems.forEach(item => {
    const selectedItem = servicesAndApps.find(s => s.value === item);
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logFile = path.join(logsDir, `${item.replace('/', '_')}_${timestamp}.log`);
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });

    const child = spawn(selectedItem.command, {
      shell: true,
      cwd: path.join(__dirname, '..', item),
    });

    child.stdout.on('data', data => {
      process.stdout.write(`[${selectedItem.name}] ${data}`);
      logStream.write(data);
    });

    child.stderr.on('data', data => {
      process.stderr.write(`[${selectedItem.name}] ${data}`);
      logStream.write(data);
    });

    console.log(`Started ${selectedItem.name}. Logs: ${logFile}`);

    child.on('close', code => {
      console.log(`${selectedItem.name} exited with code ${code}`);
      logStream.end();
    });
  });
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
