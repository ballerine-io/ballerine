/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@ballerine/eslint-config'],
  env: {
    browser: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },
};
