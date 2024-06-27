import { QueryClientProvider } from '@tanstack/react-query';
import { FunctionComponent, PropsWithChildren } from 'react';
import { queryClient } from '../../../../lib/react-query/query-client';
import { AuthProvider } from '../../../../domains/auth/context/AuthProvider/AuthProvider';
import { env } from '../../../env/env';
import { useLocation } from 'react-router-dom';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { state } = useLocation();
  const locale = useLocale();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        redirectAuthenticatedTo={`/${locale}/home/statistics`}
        redirectUnauthenticatedTo={`/${locale}/auth/sign-in`}
        signInOptions={{
          redirect: env.VITE_AUTH_ENABLED,
          callbackUrl: state?.from
            ? `${state?.from?.pathname}${state?.from?.search}`
            : `/${locale}/home/statistics`,
        }}
        signOutOptions={{
          redirect: env.VITE_AUTH_ENABLED,
          callbackUrl: `/${locale}/auth/sign-in`,
        }}
      >
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};
