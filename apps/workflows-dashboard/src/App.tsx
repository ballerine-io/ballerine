import { queryClient } from '@app/lib/react-query/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function App() {
  const navigate = useNavigate();

  useEffect(() => navigate('/workflows', { replace: true }), [navigate]);

  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </QueryParamProvider>
  );
}
