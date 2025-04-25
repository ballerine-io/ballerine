import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';
import terminal from 'vite-plugin-terminal';
import tsconfigPaths from 'vite-tsconfig-paths';
import topLevelAwait from 'vite-plugin-top-level-await';
import { visualizer } from 'rollup-plugin-visualizer';

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
      // visualizer({
      //   open: true,
      //   filename: 'dist/stats.html',
      //   gzipSize: true,
      //   brotliSize: true,
      //   template: 'treemap',
      // }),
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
          manualChunks: {
            'vendor-react-core': ['react', 'react-dom', 'react/jsx-runtime'],
            'vendor-animation': ['framer-motion'],
            'vendor-charts': ['recharts'],
            'vendor-pdf-image': ['@react-pdf/renderer', 'jspdf'],
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
