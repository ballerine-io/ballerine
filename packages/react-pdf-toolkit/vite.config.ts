import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ copyDtsFiles: true })],
  server: {
    port: 5225,
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/build.ts'),
      formats: ['cjs', 'es'],
      name: 'build',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    minify: true,
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
});
