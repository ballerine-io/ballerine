import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { endUsersQueryKeys } from '../../query-keys';

export const useEndUsersByIdsQuery = ({ ids }: { ids: string[] }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...endUsersQueryKeys.byIds({ ids }),
    enabled: !!ids?.length && isAuthenticated,
  });
};
