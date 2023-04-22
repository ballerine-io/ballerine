module.exports = {
  ...require('../../packages/config/prettierrc.base.cjs'),
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  pluginSearchDirs: false,
};
