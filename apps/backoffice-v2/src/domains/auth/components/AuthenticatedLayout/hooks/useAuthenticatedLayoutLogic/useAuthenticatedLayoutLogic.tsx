import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { env } from '@/common/env/env';
import { useNotes } from '@/domains/notes/hooks/useNotes';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useAuthContext } from '../../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

export const useAuthenticatedLayoutLogic = () => {
  const { redirectUnauthenticatedTo } = useAuthContext();

  const { isLoading } = useAuthenticatedUserQuery();

  const isAuthenticated = useIsAuthenticated();

  const location = useLocation();

  const locale = useLocale();

  const shouldRedirect = useMemo(
    () =>
      [!isLoading, !isAuthenticated, !!redirectUnauthenticatedTo, env.VITE_AUTH_ENABLED].every(
        Boolean,
      ),
    [isLoading, isAuthenticated, redirectUnauthenticatedTo],
  );

  const { isNotesOpen } = useNotes();

  return {
    isNotesOpen,
    shouldRedirect,
    isLoading,
    redirectUnauthenticatedTo,
    location,
    locale,
  };
};
