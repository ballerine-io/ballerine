import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  dts: true,
  minify: !options.watch,
  clean: true,
  format: ['esm', 'cjs'],
  legacyOutput: true,
}));
