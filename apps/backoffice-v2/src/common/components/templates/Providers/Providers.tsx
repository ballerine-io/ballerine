import { QueryClientProvider } from '@tanstack/react-query';
import { FunctionComponent, PropsWithChildren } from 'react';

import { queryClient } from '@/lib/react-query/query-client';
import { AuthProvider } from '@/domains/auth/context/AuthProvider/AuthProvider';
import { TooltipProvider } from '@ballerine/ui';

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
