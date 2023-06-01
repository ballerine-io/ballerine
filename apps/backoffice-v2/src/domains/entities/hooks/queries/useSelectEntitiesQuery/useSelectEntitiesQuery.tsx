import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../query-keys';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { TEntities } from '../../../types';

export const useSelectEntitiesQuery = <TQueryFnData = TEntities,>(
  select: (data: TEntities) => TQueryFnData,
) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();

  return useQuery({
    ...queryKeys[entity as keyof typeof queryKeys].list(filterId),
    select,
  });
};
