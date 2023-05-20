import { useGetSessionQuery } from '../../../../lib/react-query/queries/useGetSessionQuery/useGetSessionQuery';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { env } from '../../../../env/env';
import { useIsAuthenticated } from '../useIsAuthenticated/useIsAuthenticated';

export const useAuthRedirects = ({
  protectedRoutes,
  redirectAuthenticatedTo,
  redirectUnauthenticatedTo,
}) => {
  const { isLoading } = useGetSessionQuery();
  const isAuthenticated = useIsAuthenticated();
  const { history, navigate } = useRouter();
  const { pathname } = history.location;

  useEffect(() => {
    const shouldRedirect = [
      // When loading the user could be signed in or signed out.
      !isLoading,
      env.VITE_AUTH_ENABLED,
      !!redirectAuthenticatedTo,
      isAuthenticated,
      !pathname.startsWith(redirectAuthenticatedTo),
      // Remove once authenticated layout is implemented.
      !protectedRoutes?.every(route => pathname.startsWith(route)),
    ].every(Boolean);

    if (!shouldRedirect) return;

    // Navigate to the entities page if the user is signed in.

    void navigate({
      to: redirectAuthenticatedTo,
      replace: true,
      params: undefined,
      search: undefined,
    });
  }, [isLoading, isAuthenticated, navigate, pathname, redirectAuthenticatedTo, protectedRoutes]);

  useEffect(() => {
    const shouldRedirect = [
      !isLoading,
      env.VITE_AUTH_ENABLED,
      !!redirectUnauthenticatedTo,
      !isAuthenticated,
      pathname !== redirectUnauthenticatedTo,
    ].every(Boolean);

    if (!shouldRedirect) return;

    // Navigate to the sign-in page if the user is signed out.
    navigate({
      to: redirectUnauthenticatedTo,
      replace: true,
      params: undefined,
      search: undefined,
    });
  }, [isLoading, isAuthenticated, navigate, pathname, redirectUnauthenticatedTo]);
};
