const plugin = require('tailwindcss/plugin');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./*.html', './src/**/*.css', './src/**/*.tsx'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'ballerine-black': '#4D4D4D',
        'ballerine-blue': '#3F77FF',
        'ballerine-dark-blue': '#1540A8',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
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
    require('ballerine-daisyui'),
  ],
};
