import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import checker from 'vite-plugin-checker';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5201,
  },
  preview: {
    port: 5201,
  },
  build: {
    sourcemap: true,
  },
  plugins: [react(), tailwindcss(), checker({ typescript: true })],
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src'),
    },
  },
});
