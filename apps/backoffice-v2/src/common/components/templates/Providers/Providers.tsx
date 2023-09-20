import { QueryClientProvider } from '@tanstack/react-query';
import { FunctionComponent, PropsWithChildren } from 'react';
import { queryClient } from '../../../../lib/react-query/query-client';
import { AuthProvider } from '../../../../domains/auth/context/AuthProvider/AuthProvider';
import { env } from '../../../env/env';
import { useLocation } from 'react-router-dom';

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { state } = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        redirectAuthenticatedTo={'/en/case-management/entities'}
        redirectUnauthenticatedTo={'/en/auth/sign-in'}
        signInOptions={{
          redirect: env.VITE_AUTH_ENABLED,
          callbackUrl: state?.from
            ? `${state?.from?.pathname}${state?.from?.search}`
            : '/en/case-management/entities',
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
