import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';
import terminal from 'vite-plugin-terminal';
import tsconfigPaths from 'vite-tsconfig-paths';
import topLevelAwait from 'vite-plugin-top-level-await';

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
    },
  };
});
