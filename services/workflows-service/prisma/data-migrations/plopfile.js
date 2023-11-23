module.exports = function (plop) {
  // Data migration generator
  plop.setGenerator('data-migration', {
    description: 'Create a new data migration file',
    prompts: [
      {
        type: 'list',
        name: 'env',
        message: 'Select environment:',
        choices: ['common', 'local', 'dev', 'sb', 'prod'],
        default: 'local',
      },
      {
        type: 'input',
        name: 'migrationName',
        message: 'Enter the migration name:',
      },
    ],
    actions: [
      function (data) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        data.date = `${year}${month}${day}${hours}${minutes}${seconds}`;

        return '';
      },
      {
        type: 'add',
        path: 'prisma/data-migrations/{{env}}/{{date}}_{{snakeCase migrationName}}.ts',
        templateFile: './migration-template.hbs',
      },
    ],
  });
};
