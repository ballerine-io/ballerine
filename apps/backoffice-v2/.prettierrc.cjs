const { plugins, ...config } = require('../../packages/config/prettierrc.base.cjs');

module.exports = {
  ...config,
  plugins: [...(plugins ?? []), require('prettier-plugin-tailwindcss')],
  pluginSearchDirs: false,
};
