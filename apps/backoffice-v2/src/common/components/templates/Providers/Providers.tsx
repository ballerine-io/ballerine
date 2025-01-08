import { QueryClientProvider } from '@tanstack/react-query';
import { FunctionComponent, PropsWithChildren } from 'react';

import { queryClient } from '@/lib/react-query/query-client';
import { TooltipProvider } from '../../atoms/Tooltip/Tooltip.Provider';
import { AuthProvider } from '@/domains/auth/context/AuthProvider/AuthProvider';

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
