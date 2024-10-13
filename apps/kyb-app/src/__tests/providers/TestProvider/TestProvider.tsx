import { Head } from '@/Head';
import { ThemeProvider } from '@/common/providers/ThemeProvider';
import { queryClient } from '@/common/utils/query-client';
import { AnyChildren } from '@ballerine/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface TestProviderProps {
  children: AnyChildren;
}

export const TestProvider = ({ children }: TestProviderProps) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Head />
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
