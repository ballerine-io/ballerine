import { sentryVitePlugin, SentryVitePluginOptions } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import tailwindcss from 'tailwindcss';
import { PluginOption } from 'vite';
import checker from 'vite-plugin-checker';
import terminal from 'vite-plugin-terminal';
import topLevelAwait from 'vite-plugin-top-level-await';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { version } from './package.json';

interface PackageJson {
  name: string;
  version: string;
}

// Read the package.json file
const packageJson: PackageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
);

const plugins: PluginOption[] = [
  topLevelAwait({
    promiseExportName: '__tla',
    promiseImportName: i => `__tla_${i}`,
  }),
  react(),
  tailwindcss(),
  checker({ typescript: true, overlay: false }),
  tsconfigPaths(),
  terminal({
    output: ['console', 'terminal'],
    strip: false,
  }),
];

if (process.env.VITE_SENTRY_AUTH_TOKEN) {
  console.log('Initializing sentry');

  const isDevMode =
    process.env.VITE_ENVIRONMENT_NAME === 'development' ||
    process.env.VITE_ENVIRONMENT_NAME === 'local';

  const sentryConfig: SentryVitePluginOptions = {
    debug: isDevMode,
    authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    org: 'ballerine-5s',
    project: 'collection-flow',
    release: {
      dist: childProcess.execSync('git rev-parse HEAD').toString().trim(),
      setCommits: {
        auto: true,
      },
    },
    sourcemaps: {
      assets: ['./dist/assets'],
      ignore: ['node_modules'],
    },
  };

  plugins.push(sentryVitePlugin(sentryConfig) as PluginOption);
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5201,
    open: true,
  },
  preview: {
    port: 5201,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${version}.[hash].js`,
        chunkFileNames: `assets/[name]-${version}.[hash].js`,
        assetFileNames: `assets/[name]-${version}.[hash].[ext]`,
      },
    },
  },
  plugins,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
  },
});
