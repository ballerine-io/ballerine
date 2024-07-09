import { FunctionComponentWithChildren } from '../../../../common/types';
import React, { createContext, useMemo } from 'react';
import { env } from '../../../../common/env/env';
import { useAuthenticatedUserQuery } from '../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { FullScreenLoader } from '../../../../common/components/molecules/FullScreenLoader/FullScreenLoader';
import { useRedirectToRootUrl } from '@/common/hooks/useRedirectToRootUrl/useRedirectToRootUrl';
import { useLocation } from 'react-router-dom';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const AuthContext = createContext<{
  redirectAuthenticatedTo?: string;
  redirectUnauthenticatedTo?: string;
  signInOptions?: {
    redirect: boolean;
    callbackUrl: string;
  };
  signOutOptions?: {
    redirect: boolean;
    callbackUrl: string;
  };
}>(undefined);

export const AuthProvider: FunctionComponentWithChildren = ({ children }) => {
  const { isLoading } = useAuthenticatedUserQuery();
  const urlToRoot = useRedirectToRootUrl();
  const { state } = useLocation();
  const locale = useLocale();
  const contextValues = useMemo(
    () => ({
      redirectAuthenticatedTo: urlToRoot,
      redirectUnauthenticatedTo: `/${locale}/auth/sign-in`,
      signInOptions: {
        redirect: env.VITE_AUTH_ENABLED,
        callbackUrl: state?.from ? `${state?.from?.pathname}${state?.from?.search}` : urlToRoot,
      },
      signOutOptions: {
        redirect: env.VITE_AUTH_ENABLED,
        callbackUrl: `/${locale}/auth/sign-in`,
      },
    }),
    [locale, state?.from, urlToRoot],
  );

  // Don't render the children to avoid a flash of wrong state (i.e. authenticated layout).
  if (isLoading && env.VITE_AUTH_ENABLED) return <FullScreenLoader />;

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};
