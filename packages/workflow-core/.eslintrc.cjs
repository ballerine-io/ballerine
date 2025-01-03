/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@ballerine/eslint-config'],
  rules: {
    'no-console': 'error',
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },
};
