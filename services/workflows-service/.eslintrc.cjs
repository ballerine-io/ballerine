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
  },
  plugins: ['ballerine'],
};
