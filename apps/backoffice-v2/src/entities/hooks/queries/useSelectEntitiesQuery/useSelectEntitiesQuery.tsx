import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../../lib/react-query/query-keys';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { TEntities } from '../../../types';

export const useSelectEntitiesQuery = <TQueryFnData,>(
  select: (data: TEntities) => TQueryFnData,
) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();

  return useQuery({
    ...queryKeys[entity as keyof typeof queryKeys].list(filterId),
    select,
  });
};
