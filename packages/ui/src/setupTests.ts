import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

if (matchers) {
  // Extend Vitest's expect with jest-dom matchers
  expect.extend(matchers);
}

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('CSS')) {
    return;
  }

  originalConsoleError.call(console, ...args);
};

console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('CSS')) {
    return;
  }

  originalConsoleWarn.call(console, ...args);
};

console.log = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('CSS')) {
    return;
  }

  originalConsoleLog.call(console, ...args);
};

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});
