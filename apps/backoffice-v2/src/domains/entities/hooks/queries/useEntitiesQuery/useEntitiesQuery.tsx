import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEntityType } from '../../../../../common/hooks/useEntityType/useEntityType';
import { queryKeys } from '../../../query-keys';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { TEntities } from '../../../types';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useEntitiesQuery = <TQueryFnData = TEntities,>(
  options: UseQueryOptions<TQueryFnData> & {
    select?: (entities: TEntities) => TQueryFnData;
  },
) => {
  const entity = useEntityType();
  const filterId = useFilterId();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...queryKeys[entity]?.list?.(filterId),
    enabled: !!filterId && isAuthenticated,
    ...options,
  });
};
