import { svelte } from '@sveltejs/vite-plugin-svelte';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }: { mode: UserConfig['mode'] }) => {
  console.log('VITE', mode);

  return defineConfig({
    server: {
      port: 5202,
      open: true,
      host: 'localhost',
    },
    preview: {
      port: 5202,
    },
    build: {
      reportCompressedSize: true,
      chunkSizeWarningLimit: 300,
    },
    plugins: [svelte()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  });
};
