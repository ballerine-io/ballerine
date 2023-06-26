import { sessionKeys } from '@app/domains/auth/api/session/query-keys';
import { queryClient } from '@app/lib/react-query/query-client';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

const ONE_MINUTE_IN_MS = 1000 * 60;

export function useSession() {
  const { data: user, isLoading } = useQuery({
    ...sessionKeys.details(),
    refetchInterval: ONE_MINUTE_IN_MS,
  });

  const isAuthenticated = Boolean(!isLoading && user);

  const refresh = useCallback(() => queryClient.invalidateQueries(sessionKeys.details()), []);

  return {
    isLoading,
    isAuthenticated,
    user,
    refresh,
  };
}
