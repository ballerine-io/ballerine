import 'cross-fetch/polyfill';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { resetResponse, server } from './msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetResponse();
  vi.resetAllMocks();
});
afterAll(() => server.close());
