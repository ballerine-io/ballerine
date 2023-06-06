import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../query-keys';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { TEntities } from '../../../types';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useSelectEntitiesQuery = <TQueryFnData = TEntities,>(
  select: (data: TEntities) => TQueryFnData,
) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...queryKeys[entity as keyof typeof queryKeys]?.list?.(filterId),
    enabled: !!filterId && isAuthenticated,
    select,
  });
};
