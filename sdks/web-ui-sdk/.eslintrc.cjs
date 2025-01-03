const { parserOptions, settings, ...config } = require('../../packages/config/eslintrc.svelte.cjs');

module.exports = {
  ...config,

  parserOptions: {
    ...parserOptions,

    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },

  settings: {
    ...settings,
    'svelte3/typescript': require('typescript'),
  },
};
