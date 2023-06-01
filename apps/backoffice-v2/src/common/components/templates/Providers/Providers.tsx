import { QueryClientProvider } from '@tanstack/react-query';
import { FunctionComponent, PropsWithChildren } from 'react';
import { queryClient } from '../../../../lib/react-query/query-client';
import { AuthProvider } from '../../../../domains/auth/context/AuthProvider/AuthProvider';
import { env } from '../../../env/env';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        protectedRoutes={
          [
            // Uses String.prototype.startsWith until authenticated layout is implemented.
            '/en/case-management/',
          ] as const
        }
        redirectAuthenticatedTo={'/en/case-management/entities'}
        redirectUnauthenticatedTo={'/en/auth/sign-in'}
        signInOptions={{
          redirect: env.VITE_AUTH_ENABLED,
          callbackUrl: '/en/case-management/entities',
        }}
        signOutOptions={{
          redirect: env.VITE_AUTH_ENABLED,
          callbackUrl: '/en/auth/sign-in',
        }}
      >
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};
