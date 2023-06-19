import { FunctionComponentWithChildren } from '../../../types';
import { useIsAuthenticated } from '../../../../domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { UnauthenticatedLayout } from '../../../../domains/auth/components/UnauthenticatedLayout';
import { AuthenticatedLayout } from '../../../../domains/auth/components/AuthenticatedLayout';
import React from 'react';
import { env } from '../../../env/env';

export const Layout: FunctionComponentWithChildren = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated && env.VITE_AUTH_ENABLED) {
    return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};
