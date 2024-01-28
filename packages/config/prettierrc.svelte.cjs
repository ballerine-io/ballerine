module.exports = {
  ...require('./prettierrc.base.cjs'),
  plugins: ['prettier-plugin-svelte'],
  svelteSortOrder: 'options-scripts-markup-styles',
  svelteStrictMode: false,
  bracketSameLine: false,
  svelteIndentScriptAndStyle: true,
  svelteAllowShorthand: true,
};
