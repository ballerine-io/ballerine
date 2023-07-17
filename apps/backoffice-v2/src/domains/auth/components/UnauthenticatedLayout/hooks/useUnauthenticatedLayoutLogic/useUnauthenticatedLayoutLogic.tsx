import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useAuthContext } from '../../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export const useUnauthenticatedLayoutLogic = () => {
  const { isLoading } = useAuthenticatedUserQuery();
  const isAuthenticated = useIsAuthenticated();
  const { redirectAuthenticatedTo } = useAuthContext();
  const { state } = useLocation();
  const shouldRedirect = useMemo(
    () => [!isLoading, isAuthenticated, redirectAuthenticatedTo].every(Boolean),
    [isLoading, isAuthenticated, redirectAuthenticatedTo],
  );

  return {
    isLoading,
    shouldRedirect,
    redirectAuthenticatedTo,
    state,
  };
};
