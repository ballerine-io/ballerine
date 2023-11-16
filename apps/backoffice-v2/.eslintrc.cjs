/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['plugin:tailwindcss/recommended', '@ballerine/eslint-config-react'],
  settings: {
    tailwindcss: {
      callees: ['ctw'],
    },
  },
};
