import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

if (matchers) {
  // Extend Vitest's expect with jest-dom matchers
  expect.extend(matchers);
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

global.jest = vi;
