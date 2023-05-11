import { TEndUsers } from '../../../../api/types';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../queries';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import { useFilterId } from 'hooks/useFilterId/useFilterId';

export const useSelectEndUsersQuery = <TQueryFnData,>(
  select: (data: TEndUsers) => TQueryFnData,
) => {
  const entity = useFilterEntity();
  const filterId = useFilterId();

  return useQuery({
    ...queries[entity].list(filterId),
    select,
  });
};
