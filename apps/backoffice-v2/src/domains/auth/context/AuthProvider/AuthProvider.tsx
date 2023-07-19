import { FunctionComponentWithChildren } from '../../../../common/types';
import React, { createContext, useMemo } from 'react';
import { env } from '../../../../common/env/env';
import { useAuthenticatedUserQuery } from '../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { FullScreenLoader } from '../../../../common/components/molecules/FullScreenLoader/FullScreenLoader';

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

  // Don't render the children to avoid a flash of wrong state (i.e. authenticated layout).
  if (isLoading && env.VITE_AUTH_ENABLED) return <FullScreenLoader />;

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};
