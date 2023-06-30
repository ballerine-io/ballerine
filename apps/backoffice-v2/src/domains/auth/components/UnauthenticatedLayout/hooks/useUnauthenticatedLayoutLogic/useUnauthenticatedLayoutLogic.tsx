import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useAuthContext } from '../../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useLocation } from 'react-router-dom';

export const useUnauthenticatedLayoutLogic = () => {
  const { isLoading } = useAuthenticatedUserQuery();
  const isAuthenticated = useIsAuthenticated();
  const { redirectAuthenticatedTo } = useAuthContext();
  const { state } = useLocation();
  const shouldRedirect = [!isLoading, isAuthenticated, redirectAuthenticatedTo].every(Boolean);

  return {
    isLoading,
    shouldRedirect,
    redirectAuthenticatedTo,
    state,
  };
};
