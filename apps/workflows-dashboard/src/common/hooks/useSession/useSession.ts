import { sessionKeys } from '@/domains/auth/api/session/query-keys';
import { useQuery } from '@tanstack/react-query';

const ONE_MINUTE_IN_MS = 1000 * 60;

export function useSession() {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    ...sessionKeys.details(),
    // @ts-ignore
    refetchInterval: ONE_MINUTE_IN_MS,
    retry: (retryCount: number) => retryCount < 3,
  });

  const isAuthenticated = Boolean(!isLoading && user);

  return {
    isLoading,
    isAuthenticated,
    user,
    refresh: refetch,
  };
}
