import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { endUsersQueryKeys } from '../../query-keys';

export const useEndUserByIdQuery = ({ id }: { id: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...endUsersQueryKeys.byId({ id }),
    enabled: !!id && isAuthenticated,
  });
};
