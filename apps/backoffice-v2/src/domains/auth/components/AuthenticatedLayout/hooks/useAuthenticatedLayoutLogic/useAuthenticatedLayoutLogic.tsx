import { useAuthContext } from '../../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { env } from '../../../../../../common/env/env';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export const useAuthenticatedLayoutLogic = () => {
  const { redirectUnauthenticatedTo } = useAuthContext();
  const { isLoading } = useAuthenticatedUserQuery();
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const shouldRedirect = useMemo(
    () =>
      [!isLoading, !isAuthenticated, !!redirectUnauthenticatedTo, env.VITE_AUTH_ENABLED].every(
        Boolean,
      ),
    [isLoading, isAuthenticated, redirectUnauthenticatedTo],
  );

  return {
    shouldRedirect,
    isLoading,
    redirectUnauthenticatedTo,
    location,
  };
};
