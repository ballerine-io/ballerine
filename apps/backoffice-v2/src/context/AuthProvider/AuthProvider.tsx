import { FunctionComponentWithChildren } from '../../types';
import { createContext, useMemo } from 'react';
import { env } from '../../env/env';
import { useAuthRedirects } from './hooks/useAuthRedirects/useAuthRedirects';
import { useAuthenticatedUserQuery } from '../../auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

export const AuthContext = createContext(undefined);

// Remove underscore once @tanstack/react-router layouts are fixed.
// Navigate based on if the user is signed in or signed out and the current page.
export const _AuthProvider: FunctionComponentWithChildren<{
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
  redirectAuthenticatedTo,
  redirectUnauthenticatedTo,
  signInOptions,
  signOutOptions,
}) => {
  const contextValues = useMemo(
    () => ({
      redirectAuthenticatedTo,
      redirectUnauthenticatedTo,
      signInOptions,
      signOutOptions,
    }),
    [redirectAuthenticatedTo, redirectUnauthenticatedTo, signInOptions, signOutOptions],
  );

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};

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
