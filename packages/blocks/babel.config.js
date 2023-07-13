const cjs = process.env.NODE_ENV === 'test' || process.env.BABEL_ENV === 'commonjs';
const loose = true;

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose,
        modules: false,
        bugfixes: true,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [cjs && ['@babel/transform-modules-commonjs', { loose }]].filter(Boolean),
};
