import { useAuthContext } from '../../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useEffect } from 'react';
import { env } from '../../../../../../common/env/env';
import { useLocation, useNavigate } from 'react-router-dom';

export const useAuthenticatedLayout = () => {
  const { redirectUnauthenticatedTo } = useAuthContext();
  const { isLoading } = useAuthenticatedUserQuery();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const disableRedirect = true;

  useEffect(() => {
    // When loading the user could be signed in or signed out.
    if (isLoading || !env.VITE_AUTH_ENABLED) return;

    // Navigate to the sign-in page if the user is signed out.
    if (
      disableRedirect ||
      isAuthenticated ||
      !redirectUnauthenticatedTo ||
      pathname === redirectUnauthenticatedTo
    )
      return;

    void navigate(redirectUnauthenticatedTo, {
      replace: true,
    });
  }, [isLoading, isAuthenticated, navigate, pathname, redirectUnauthenticatedTo, disableRedirect]);
};
