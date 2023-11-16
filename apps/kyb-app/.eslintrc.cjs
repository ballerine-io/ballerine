const config = require('../../packages/config/eslintrc.base.cjs');

module.exports = {
  ...config,
  env: {
    ...config.env,
    browser: true,
  },
  parserOptions: {
    ...config.parserOptions,
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['tailwindcss', ...(config.plugins ?? [])],
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    ...(config.extends ?? []),
  ],
  rules: {
    ...config.rules,
    '@typescript-eslint/ban-ts-comment': 'warn',
    'comma-dangle': 'off',
    'multiline-ternary': 'off',
    'no-use-before-define': 'off',
    'space-before-function-paren': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/no-custom-classname': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
  settings: {
    ...config.settings,
    tailwindcss: {
      callees: ['ctw'],
    },
    react: {
      version: 'detect',
    },
  },
};
