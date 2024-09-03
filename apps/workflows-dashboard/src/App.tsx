import { queryClient } from '@/lib/react-query/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export function App() {
  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster richColors />
      </QueryClientProvider>
    </QueryParamProvider>
  );
}
