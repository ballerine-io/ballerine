import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  console.log('building with vite...', mode);
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    build: {
      reportCompressedSize: true,
      chunkSizeWarningLimit: 300,
      rollupOptions: {
        output: {
          format: 'umd',
          inlineDynamicImports: true,
          banner: `/*! Ballerine SDK - v${env.npm_package_version} - ${env.NODE_ENV}-build */`,
        },
      },
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'BallerineSDK',
        formats: ['es', 'umd'],
        fileName: 'ballerine-sdk',
      },
    },
    plugins: [
      svelte({ emitCss: false }),
      dts({
        insertTypesEntry: true,
      }),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  });
};
