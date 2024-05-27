/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
  },
  extends: ['@ballerine/eslint-config'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};
