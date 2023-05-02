import { QueryClient } from '@tanstack/svelte-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Otherwise 404 will result in infinite retries.
      retry: 0,
      refetchInterval: parseInt(import.meta.env.VITE_POLLING_INTERVAL) * 1000 || false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
