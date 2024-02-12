module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['plugin:import/recommended', 'plugin:import/typescript', '@ballerine/eslint-config'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['**/tsconfig.json'],
      },
    },
  },
  rules: {
    'import/no-cycle': 'error',
    'ballerine/verify-repository-project-scoped': 'error',
    "@ts-safeql/check-sql": [
      "error",
      {
        "connections": [
          {
            // The migrations path:
            "migrationsDir": "./prisma/migrations",
            "targets": [
              {
                // The sql tags that should be checked.
                // either `db.$queryRaw` or `db.$executeRaw`:
                "tag": "prisma.+($queryRaw|$executeRaw|sql)",
                // Transform the query result to array
                "transform": "{type}[]"
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: ['ballerine', '@ts-safeql/eslint-plugin'],
};
