const { plugins, ...config } = require('../../packages/config/prettierrc.base.cjs');

module.exports = {
  ...config,
  plugins: [require('prettier-plugin-tailwindcss'), ...(plugins ?? [])],
};
