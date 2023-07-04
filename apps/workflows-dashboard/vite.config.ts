import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import checker from 'vite-plugin-checker';
import terminal from 'vite-plugin-terminal';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5200,
  },
  plugins: [
    react(),
    tailwindcss(),
    checker({ typescript: true }),
    terminal({
      output: ['console', 'terminal'],
      strip: false,
    }),
  ],
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src'),
    },
  },
});
