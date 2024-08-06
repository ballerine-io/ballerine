/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@ballerine/eslint-config-react'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};
