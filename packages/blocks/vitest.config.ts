import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths() as Plugin],
  test: {
    include: ['src/**/*.(test|spec).ts'],
    coverage: {
      provider: 'istanbul',
    },
  },
});
