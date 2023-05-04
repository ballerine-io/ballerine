import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    host: true,
  },
  plugins: [tsconfigPaths(), svelte()],
});
