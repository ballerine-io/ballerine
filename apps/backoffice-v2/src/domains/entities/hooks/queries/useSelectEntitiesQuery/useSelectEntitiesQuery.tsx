import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../query-keys';
import { useEntityType } from '../../../../../common/hooks/useEntityType/useEntityType';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { TEntities } from '../../../types';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useSelectEntitiesQuery = <TQueryFnData = TEntities,>(
  select: (data: TEntities) => TQueryFnData,
) => {
  const entity = useEntityType();
  const filterId = useFilterId();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...queryKeys[entity]?.list?.(filterId),
    enabled: !!filterId && isAuthenticated,
    select,
  });
};
