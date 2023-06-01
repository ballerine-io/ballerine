import { TEndUsers } from '../../../../api/types';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../queries';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useSelectEndUsersQuery = <TQueryFnData,>(
  select: (data: TEndUsers) => TQueryFnData,
) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...queries[entity].list(filterId),
    enabled: !!filterId && isAuthenticated,
    select,
  });
};
