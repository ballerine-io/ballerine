import { FunctionComponentWithChildren } from '../../../../common/types';
import { createContext, useMemo } from 'react';
import { env } from '../../../../common/env/env';
import { useAuthenticatedUserQuery } from '../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useAuthRedirects } from './hooks/useAuthRedirects/useAuthRedirects';

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

export const AuthProvider: FunctionComponentWithChildren<{
  protectedRoutes?: readonly string[];
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
}> = ({
  children,
  protectedRoutes,
  redirectAuthenticatedTo,
  redirectUnauthenticatedTo,
  signInOptions,
  signOutOptions,
}) => {
  const { isLoading } = useAuthenticatedUserQuery();
  const contextValues = useMemo(
    () => ({
      redirectAuthenticatedTo,
      redirectUnauthenticatedTo,
      signInOptions,
      signOutOptions,
    }),
    [redirectAuthenticatedTo, redirectUnauthenticatedTo, signInOptions, signOutOptions],
  );

  useAuthRedirects({
    protectedRoutes,
    redirectAuthenticatedTo,
    redirectUnauthenticatedTo,
  });

  // Don't render the children to avoid a flash of wrong state (i.e. authenticated layout).
  if (isLoading && env.VITE_AUTH_ENABLED) return null;

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};
