module.exports = {
  env: {
    node: true,
  },
  extends: ['plugin:import/recommended', 'plugin:import/typescript', '@ballerine/eslint-config'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: true,
    },
  },
  rules: {
    'import/no-cycle': 'error',
    'ballerine/verify-repository-project-scoped': 'error',
  },
  ignorePatterns: ['.eslintrc.cjs'],
  plugins: ['ballerine'],
};
