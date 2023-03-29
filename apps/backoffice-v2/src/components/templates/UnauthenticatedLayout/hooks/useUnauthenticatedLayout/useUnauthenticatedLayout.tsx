import { useGetSessionQuery } from '@/lib/react-query/queries/useGetSessionQuery/useGetSessionQuery';
import { useIsAuthenticated } from '@/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useAuthContext } from '@/context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useEffect } from 'react';
import { env } from '@/env/env';
import { useRouter } from '@tanstack/react-router';

export const useUnauthenticatedLayout = () => {
  const { isLoading } = useGetSessionQuery();
  const isAuthenticated = useIsAuthenticated();
  const { history, navigate } = useRouter();
  const { pathname } = history.location;
  const { redirectAuthenticatedTo } = useAuthContext();
  const disableRedirect = true;

  useEffect(() => {
    // When loading the user could be signed in or signed out.
    if (isLoading || !env.VITE_AUTH_ENABLED) return;

    // Navigate to the individuals page if the user is signed in.
    if (
      // Implement authenticated layout before removing disableRedirect.
      disableRedirect ||
      !isAuthenticated ||
      !redirectAuthenticatedTo ||
      pathname.startsWith(redirectAuthenticatedTo)
    )
      return;

    navigate({
      to: redirectAuthenticatedTo,
      replace: true,
      params: undefined,
      search: undefined,
    });
  }, [isLoading, isAuthenticated, navigate, pathname, redirectAuthenticatedTo]);
};
