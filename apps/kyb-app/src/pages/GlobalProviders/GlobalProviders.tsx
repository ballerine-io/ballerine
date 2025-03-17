import { AccessTokenProvider } from '@/common/providers/AccessTokenProvider';
import { DependenciesProvider } from '@/common/providers/DependenciesProvider';
import { ThemeProvider } from '@/common/providers/ThemeProvider';
import { queryClient } from '@/common/utils/query-client';
import { Head } from '@/Head';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

export const GlobalProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Head />
      <ThemeProvider>
        <AccessTokenProvider>
          <DependenciesProvider>
            <Outlet />
          </DependenciesProvider>
        </AccessTokenProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
