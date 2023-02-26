const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./*.html', './src/**/*.css', './src/**/*.tsx'],
  plugins: [
    plugin(function ({ matchUtilities, theme, matchVariant, addVariant }) {
      matchUtilities(
        {
          // Adds support for d-full instead of w-full h-full
          d: value => ({
            width: value,
            height: value,
          }),
          // Adds support for top-left-5 instead of top-5 left-5
          'top-left': value => ({
            top: value,
            left: value,
          }),
          // Adds support for top-right-5 instead of top-5 right-5
          'top-right': value => ({
            top: value,
            right: value,
          }),
          // Adds support for bottom-right-5 instead of bottom-5 right-5
          'bottom-right': value => ({
            bottom: value,
            right: value,
          }),
          // Adds support for bottom-left-5 instead of bottom-5 left-5
          'bottom-left': value => ({
            bottom: value,
            left: value,
          }),
        },
        {
          values: theme(`spacing`),
        },
      );

      // Adds support for styling children of a parent
      addVariant('children', '& > *');

      // Adds support for &:not(:first-child)
      addVariant('not-first', '&:not(:first-child)');

      // Adds support for &:not(:last-child)
      addVariant('not-last', '&:not(:last-child)');

      // Adds support for using the root element's 'data-theme' attribute
      matchVariant('theme', value => `[data-theme="${value}"] &`, {
        values: {
          light: 'winter',
          dark: 'night',
        },
      });
    }),
    require('daisyui'),
  ],
  theme: {
    extend: {
      colors: {
        'ballerine-black': '#4D4D4D',
        'ballerine-blue': '#3F77FF',
        'ballerine-dark-blue': '#1540A8',
      },
    },
  },
};
