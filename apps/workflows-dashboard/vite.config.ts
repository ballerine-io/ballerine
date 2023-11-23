import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import checker from 'vite-plugin-checker';
import terminal from 'vite-plugin-terminal';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5200,
  },
  preview: {
    port: 5200,
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    checker({ typescript: true }),
    terminal({
      output: ['console', 'terminal'],
      strip: false,
    }),
    tsconfigPaths(),
  ],
});
