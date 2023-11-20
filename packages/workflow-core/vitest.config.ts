import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30000,
    include: ['src/**/*.(test|spec).ts', 'src/**/*.(test|spec).(unit|intg|e2e).ts'],
    coverage: {
      provider: 'istanbul',
    },
  },
});
