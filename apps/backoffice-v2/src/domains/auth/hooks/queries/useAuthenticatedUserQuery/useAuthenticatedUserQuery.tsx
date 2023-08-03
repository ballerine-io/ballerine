import { useQuery } from '@tanstack/react-query';
import { authQueryKeys } from '../../../query-keys';

export const useAuthenticatedUserQuery = () => {
  return useQuery({
    ...authQueryKeys.authenticatedUser(),
    staleTime: 100_000,
    refetchInterval: 100_000,
  });
};
