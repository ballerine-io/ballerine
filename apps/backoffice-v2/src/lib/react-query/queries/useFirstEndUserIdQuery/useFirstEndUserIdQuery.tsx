import { TRouteId } from '@/types';
import { useSearch as useTanStackSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { sort } from '@/hooks/useSort/sort';
import { TEndUsers } from '@/api/types';
import { useSelectEndUsersQuery } from '../useSelectEndUsersQuery/useSelectEndUsersQuery';

export const useFirstEndUserIdQuery = <TId extends TRouteId>({
  initialState,
  routeId,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: keyof TEndUsers[number];
  };
  routeId: TId;
}) => {
  const { sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' } =
    useTanStackSearch({
      from: routeId,
      strict: false,
      track: searchParams => ({
        sortBy: 'sortBy' in searchParams ? searchParams?.sortBy : undefined,
        sortDir: 'sortDir' in searchParams ? searchParams?.sortDir : undefined,
      }),
    });
  const selectFirstEndUserId = useCallback(
    (data: TEndUsers) =>
      sort({
        data,
        sortBy,
        sortDir,
      })?.[0]?.id,
    [sortDir, sortBy],
  );

  return useSelectEndUsersQuery(selectFirstEndUserId);
};
