import type { UserConfig } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default ({ mode }: { mode: UserConfig['mode'] }) => {
  console.log('VITE', mode);
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    server: {
      port: 3000,
      host: '127.0.0.1',
    },
    build: {
      reportCompressedSize: true,
      chunkSizeWarningLimit: 300,
    },
    plugins: [
      svelte(),
      // createHtmlPlugin({
      //   inject: {
      //     data: {
      //       __APP_ENV__: env.APP_ENV,
      //     },
      //   },
      // }),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  });
};
