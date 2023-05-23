import { useQuery } from '@tanstack/react-query';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { queryKeys } from '../../../query-keys';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { TEntities } from '../../../types';

export const useEntitiesQuery = <TQueryFnData = TEntities,>({
  select,
}: {
  select?: (data: TEntities) => TQueryFnData;
} = {}) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();

  return useQuery({
    ...queryKeys[entity as keyof typeof queryKeys].list(filterId),
    select,
  });
};
