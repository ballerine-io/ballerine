/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: ['@ballerine/eslint-config'],
  ignorePatterns: ['.eslintrc.cjs', 'rollup.config.js'],
};
