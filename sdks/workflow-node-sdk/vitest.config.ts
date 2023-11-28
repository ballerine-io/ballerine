import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.(test|spec).ts'],
    coverage: {
      provider: 'istanbul',
    },
  },
});
