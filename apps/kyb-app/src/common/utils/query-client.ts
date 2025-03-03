import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryOnMount: false,
      staleTime: 100_000,
      useErrorBoundary: (error, query) => {
        // Only show error boundary for network errors
        return error instanceof TypeError;
      },
    },
  },
});
