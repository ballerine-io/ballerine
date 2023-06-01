import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TEndUsers } from 'src/api/types';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import { queries } from '../../queries';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useEndUsersQuery = (options: UseQueryOptions<TEndUsers> = {}) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...queries[entity].list(filterId),
    enabled: !!filterId && isAuthenticated,
    ...options,
  });
};
