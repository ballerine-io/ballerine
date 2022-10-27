module.exports = {
  ...require('./prettierrc.base.cjs'),
  plugins: ['prettier-plugin-svelte'],
  svelteSortOrder: 'options-scripts-markup-styles',
  svelteStrictMode: false,
  svelteBracketNewLine: true,
  svelteIndentScriptAndStyle: true,
  svelteAllowShorthand: true,
};
