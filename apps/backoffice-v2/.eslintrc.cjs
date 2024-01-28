/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['plugin:tailwindcss/recommended', '@ballerine/eslint-config-react'],
  settings: {
    tailwindcss: {
      callees: ['ctw'],
    },
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/classnames-order': 'off',
  },
};
