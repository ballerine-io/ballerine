import { useAuthContext } from '../../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useEffect } from 'react';
import { env } from '../../../../../../common/env/env';
import { useRouter } from '@tanstack/react-router';

export const useAuthenticatedLayout = () => {
  const { redirectUnauthenticatedTo } = useAuthContext();
  const { isLoading } = useAuthenticatedUserQuery();
  const isAuthenticated = useIsAuthenticated();
  const { history, navigate } = useRouter();
  const { pathname } = history.location;
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

    void navigate({
      to: redirectUnauthenticatedTo,
      replace: true,
      params: undefined,
    });
  }, [isLoading, isAuthenticated, navigate, pathname, redirectUnauthenticatedTo]);
};
