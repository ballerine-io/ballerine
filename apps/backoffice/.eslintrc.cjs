module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'react-app',
    'react-app/jest',
  ],
  env: {
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // These types of configs should be relative to the package's root
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
