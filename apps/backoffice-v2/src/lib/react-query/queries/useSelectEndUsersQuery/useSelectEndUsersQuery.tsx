import { TEndUsers } from '../../../../api/types';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../queries';
import { useKind } from 'hooks/useKind/useKind';
import { useFilterId } from 'hooks/useFilterId/useFilterId';

export const useSelectEndUsersQuery = <TQueryFnData,>(
  select: (data: TEndUsers) => TQueryFnData,
) => {
  const kind = useKind();
  const filterId = useFilterId();

  return useQuery({
    ...queries[kind].list(filterId),
    select,
  });
};
