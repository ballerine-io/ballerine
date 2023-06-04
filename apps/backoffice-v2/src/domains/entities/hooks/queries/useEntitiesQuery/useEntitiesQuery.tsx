import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { queryKeys } from '../../../query-keys';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { TEntities } from '../../../types';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useEntitiesQuery = <TQueryFnData = TEntities,>(
  options: UseQueryOptions<TQueryFnData> & {
    select?: (entities: TEntities) => TQueryFnData;
  },
) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...queryKeys[entity as keyof typeof queryKeys].list(filterId),
    enabled: !!filterId && isAuthenticated,
    ...options,
  });
};
