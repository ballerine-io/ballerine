import { defineConfig, PluginOption } from 'vite';
import * as childProcess from 'child_process';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import checker from 'vite-plugin-checker';
import { resolve } from 'path';
import { sentryVitePlugin, SentryVitePluginOptions } from '@sentry/vite-plugin';
import fs from 'fs';
import path from 'path';

interface PackageJson {
  name: string;
  version: string;
}

// Read the package.json file
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const packageJson: PackageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
);

const RELEASE_NAME = `${packageJson.name}@${packageJson.version}`;

const isDevMode =
  process.env.VITE_ENVIRONMENT_NAME === 'development' ||
  process.env.VITE_ENVIRONMENT_NAME === 'local';

const sentryConfig: SentryVitePluginOptions = {
  disable: !process.env.VITE_SENTRY_AUTH_TOKEN,
  debug: isDevMode,
  authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
  org: 'ballerine-5s',
  project: 'collection-flow',
  release: {
    name: RELEASE_NAME,
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

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5201,
  },
  preview: {
    port: 5201,
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    checker({ typescript: true }),
    sentryVitePlugin(sentryConfig) as PluginOption[],
  ],
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src'),
    },
  },
});
