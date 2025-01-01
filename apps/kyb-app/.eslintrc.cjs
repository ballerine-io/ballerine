/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@ballerine/eslint-config-react'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },
};
