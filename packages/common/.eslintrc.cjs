/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@ballerine/eslint-config'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};
