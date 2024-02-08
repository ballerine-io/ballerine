/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  extends: ['@ballerine/eslint-config'],
};
