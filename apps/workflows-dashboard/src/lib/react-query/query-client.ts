import { QueryClient } from '@tanstack/react-query';

const FIVE_MIN_CACHE_TIME_IN_MS = 5 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: FIVE_MIN_CACHE_TIME_IN_MS } },
});
