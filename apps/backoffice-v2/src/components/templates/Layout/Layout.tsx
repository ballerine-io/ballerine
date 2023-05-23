import { FunctionComponentWithChildren } from '../../../types';
import { useIsAuthenticated } from '../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { UnauthenticatedLayout } from '../../../auth/components/UnauthenticatedLayout';
import { AuthenticatedLayout } from '../../../auth/components/AuthenticatedLayout';
import React from 'react';
import { env } from '../../../env/env';

export const Layout: FunctionComponentWithChildren = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated && env.VITE_AUTH_ENABLED) {
    return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};
