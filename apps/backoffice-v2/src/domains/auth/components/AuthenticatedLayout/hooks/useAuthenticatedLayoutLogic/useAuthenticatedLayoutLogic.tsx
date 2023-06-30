import { useAuthContext } from '../../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { env } from '../../../../../../common/env/env';
import { useLocation } from 'react-router-dom';

export const useAuthenticatedLayoutLogic = () => {
  const { redirectUnauthenticatedTo } = useAuthContext();
  const { isLoading } = useAuthenticatedUserQuery();
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const shouldRedirect = [
    !isLoading,
    !isAuthenticated,
    !!redirectUnauthenticatedTo,
    env.VITE_AUTH_ENABLED,
  ].every(Boolean);

  return {
    shouldRedirect,
    isLoading,
    redirectUnauthenticatedTo,
    location,
  };
};
