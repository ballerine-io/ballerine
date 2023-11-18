/** @type {import('tailwindcss').Config} */
module.exports = {
  modules: true,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
