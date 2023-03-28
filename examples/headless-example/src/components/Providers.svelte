<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import App from './App.svelte';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Otherwise 404 will result in infinite retries.
        retry: 0,
        refetchInterval: parseInt(import.meta.env.VITE_POOLING_TIME as string) * 1000 || false,
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
