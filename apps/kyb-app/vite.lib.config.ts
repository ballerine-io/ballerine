import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { PluginOption } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const plugins: PluginOption[] = [
  react(),
  tailwindcss(),
  dts({ copyDtsFiles: true, tsConfigFilePath: './tsconfig-lib.json' }),
  tsconfigPaths({
    projects: ['./tsconfig-lib.json'],
  }),
];

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'dist/collection-flow-portable',
    lib: {
      entry: {
        index: './src/lib.ts',
      },
      formats: ['es'],
      name: 'collection-flow-portable',
    },
    rollupOptions: {
      external: ['react', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
  },
});
