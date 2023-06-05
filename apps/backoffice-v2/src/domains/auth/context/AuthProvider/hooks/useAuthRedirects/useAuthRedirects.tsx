import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useEffect } from 'react';
import { env } from '../../../../../../common/env/env';
import { useIsAuthenticated } from '../useIsAuthenticated/useIsAuthenticated';
import { useLocation, useNavigate } from 'react-router-dom';

export const useAuthRedirects = ({
  protectedRoutes,
  redirectAuthenticatedTo,
  redirectUnauthenticatedTo,
}: {
  protectedRoutes: ReadonlyArray<string>;
  redirectAuthenticatedTo?: string;
  redirectUnauthenticatedTo?: string;
}) => {
  const { isLoading } = useAuthenticatedUserQuery();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

    void navigate(redirectAuthenticatedTo, {
      replace: true,
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
    navigate(redirectUnauthenticatedTo, {
      replace: true,
    });
  }, [isLoading, isAuthenticated, navigate, pathname, redirectUnauthenticatedTo]);
};
