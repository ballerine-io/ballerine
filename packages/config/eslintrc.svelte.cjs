const { env, plugins, extends: extendsRest, ...base } = require('./eslintrc.base.cjs');

module.exports = {
  ...base,
  extends: [
    'plugin:storybook/recommended',
    // Make sure the prettier config is always last
    ...extendsRest,
  ],
  env: {
    ...env,
    browser: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/ignore-styles': () => true,
  },
  plugins: [
    'svelte3',
    // Make sure plugins that have to be last are always last
    ...plugins,
  ],
};
