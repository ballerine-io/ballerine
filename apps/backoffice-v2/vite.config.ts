import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';
import terminal from 'vite-plugin-terminal';
import tsconfigPaths from 'vite-tsconfig-paths';
import topLevelAwait from 'vite-plugin-top-level-await';
import { visualizer } from 'rollup-plugin-visualizer';

// Minimum size in bytes for a separate chunk (50KB)
const MIN_CHUNK_SIZE = 50 * 1024;

export default defineConfig(configEnv => {
  const isDevelopment = configEnv.mode === 'development';

  return {
    server: {
      open: true,
      host: true,
      port: 5137,
      // port: 443,
      // https: true,
    },
    preview: {
      port: 5137,
    },
    plugins: [
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`,
      }),
      terminal({
        output: ['console', 'terminal'],
        strip: false,
      }),
      react(),
      tsconfigPaths(),
      // mkcert(),
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ],
    css: {
      modules: {
        generateScopedName: isDevelopment ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:5]',
      },
    },
    test: {
      exclude: ['e2e', 'node_modules'],
      environment: 'jsdom',
      setupFiles: ['./src/tests-setup.ts'],
    },
    build: {
      sourcemap: true,
      minify: 'terser',
      target: 'es2018',
      terserOptions: {
        compress: {
          drop_console: !isDevelopment,
          drop_debugger: !isDevelopment,
          passes: 2,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (!id.includes('node_modules')) {
              return;
            }

            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react-core';
            }

            if (
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run/router')
            ) {
              return 'vendor-react-router';
            }

            if (
              id.includes('node_modules/tailwindcss') ||
              id.includes('node_modules/daisyui') ||
              id.includes('node_modules/ballerine-daisyui')
            ) {
              return 'vendor-ui-tailwind';
            }

            if (id.includes('node_modules/framer-motion')) {
              return 'vendor-animation';
            }

            if (
              id.includes('node_modules/@radix-ui') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/lucide-react')
            ) {
              return 'vendor-ui-components';
            }

            if (id.includes('node_modules/d3') || id.includes('node_modules/recharts')) {
              return 'vendor-charts';
            }

            if (
              id.includes('node_modules/@react-pdf') ||
              id.includes('node_modules/html2canvas') ||
              id.includes('node_modules/jspdf')
            ) {
              return 'vendor-pdf-image';
            }

            if (id.includes('browser')) {
              return 'browser';
            }

            return 'vendor-deps';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
