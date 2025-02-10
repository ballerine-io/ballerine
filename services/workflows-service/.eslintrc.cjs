module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
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
        project: ['./tsconfig.json', './tsconfig.build.json'],
      },
    },
  },
  rules: {
    'import/no-cycle': 'error',
    'ballerine/verify-repository-project-scoped': 'error',
    '@typescript-eslint/no-empty-function': 'off',
  },
  plugins: ['ballerine'],
};
