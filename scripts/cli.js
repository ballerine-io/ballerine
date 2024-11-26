#!/usr/bin/env node

const inquirer = require('inquirer').default;
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ngrok = require('ngrok');
const waitOn = require('wait-on');

const getProjectInfo = (folderPath, projectPath) => {
  const packageJsonPath = path.join(__dirname, '..', folderPath, projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return {
    name: packageJson.name || projectPath,
    value: `${folderPath}/${projectPath}`,
  };
};

const projectsAndApps = [
  { folder: 'services', items: ['workflows-service'] },
  { folder: 'apps', items: ['workflows-dashboard', 'kyb-app', 'backoffice-v2'] },
].flatMap(({ folder, items }) => items.map(projectPath => getProjectInfo(folder, projectPath)));

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const getEnvFiles = projectPath => {
  const projectDir = path.join(__dirname, '..', projectPath);
  return fs
    .readdirSync(projectDir)
    .filter(file => file.startsWith('.env'))
    .map(file => ({ name: file, value: file }));
};

async function main() {
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Choose mode:',
      choices: [
        { name: 'Simple', value: 'simple' },
        { name: 'Advanced', value: 'advanced' },
      ],
    },
  ]);

  const { selectedItems, runMode } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedItems',
      message: 'Select projects and apps to run:',
      choices: [{ name: 'All', value: 'all' }, new inquirer.Separator(), ...projectsAndApps],
      default: projectsAndApps.map(item => item.value),
    },
    {
      type: 'list',
      name: 'runMode',
      message: 'Choose run mode:',
      choices: [
        { name: 'Start (no watch)', value: 'start' },
        { name: 'Dev (with watch)', value: 'dev' },
      ],
    },
  ]);

  let envFiles = {};
  let useNgrok = false;
  let resetDatabase = false;

  // Convert 'all' selection to all projects
  const finalSelectedItems = selectedItems.includes('all')
    ? projectsAndApps.map(item => item.value)
    : selectedItems;

  if (mode === 'advanced') {
    const advancedOptions = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useCommonEnv',
        message: 'Use .env for all projects?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useNgrok',
        message: 'Run ngrok for webhook requests?',
        default: false,
      },
    ]);

    useNgrok = advancedOptions.useNgrok;

    if (advancedOptions.useCommonEnv) {
      envFiles = Object.fromEntries(finalSelectedItems.map(item => [item, '.env']));
    } else {
      for (const item of finalSelectedItems) {
        const projectEnvFiles = getEnvFiles(item);
        const { envFile } = await inquirer.prompt([
          {
            type: 'list',
            name: 'envFile',
            message: `Choose .env file for ${item}:`,
            choices: [{ name: '.env (default)', value: '.env' }, ...projectEnvFiles],
            default: '.env',
          },
        ]);
        envFiles[item] = envFile;
      }
    }
  } else {
    envFiles = Object.fromEntries(finalSelectedItems.map(item => [item, '.env']));
  }

  // Check if workflows-service is selected
  if (finalSelectedItems.some(item => item.includes('workflows-service'))) {
    const { resetDatabaseConfirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'resetDatabaseConfirm',
        message: 'Do you want to reset the database?',
        default: false,
      },
    ]);
    resetDatabase = resetDatabaseConfirm;
  }

  const projectFilter = finalSelectedItems.map(item => item.split('/')[1]).join(',');
  const workflowsServiceIncluded = finalSelectedItems.some(item =>
    item.includes('workflows-service'),
  );
  const appsIncluded = finalSelectedItems.some(item => item.includes('apps/'));

  let command = `nx run-many --target=${runMode} --projects=${projectFilter
    .split(',')
    .map(project => `@ballerine/${project}`)
    .join(',')}`;

  if (resetDatabase) {
    command = `nx run-many --target=db:reset:dev:with-data --projects=@ballerine/workflows-service --output-style=stream && ${command}`;
  }

  if (workflowsServiceIncluded && appsIncluded) {
    // Remove workflows-service from the command since we'll run it separately
    const filteredProjects = projectFilter
      .split(',')
      .filter(project => project !== 'workflows-service')
      .map(project => `@ballerine/${project}`)
      .join(',');

    const filteredCommand = `nx run-many --target=${runMode} --projects=${filteredProjects}`;
    command = `nx run @ballerine/workflows-service:${runMode} & wait-on http://localhost:3000/api/v1/_health/ready && ${filteredCommand}`;
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logFile = path.join(logsDir, `nx_run_${timestamp}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });

  console.log('Using .env files:');
  Object.entries(envFiles).forEach(([project, envFile]) => {
    console.log(`  ${project}: ${envFile}`);
  });
  console.log(`Logs: ${logFile}`);

  if (useNgrok) {
    console.log('Establishing ngrok tunnel...');
    const url = await ngrok.connect(3000);
    console.log(`ngrok tunnel established: ${url}`);
  }

  console.log(`Executing command: ${command}`);
  const child = spawn(command, {
    shell: true,
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PROJECT_ENV_FILES: JSON.stringify(envFiles) },
  });

  child.stdout.on('data', data => {
    process.stdout.write(data);
    logStream.write(data);
  });

  child.stderr.on('data', data => {
    process.stderr.write(data);
    logStream.write(data);
  });

  child.on('close', code => {
    console.log(`Process exited with code ${code}`);
    logStream.end();
    if (useNgrok) {
      ngrok.kill();
    }
  });
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
