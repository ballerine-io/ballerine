<script lang="ts">
  import { queryClient } from '@/query-client';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import App from './App.svelte';
</script>

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
