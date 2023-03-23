import { useParams, useSearch as useTanStackSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { sort } from 'hooks/useSort/sort';
import { TRouteId } from '../../../../types';
import { TEndUsers } from '../../../../api/types';
import { useSelectEndUsersQuery } from '../useSelectEndUsersQuery/useSelectEndUsersQuery';

export const useNextEndUserIdQuery = <TId extends TRouteId>({
  initialState,
  routeId,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: keyof TEndUsers[number];
  };
  routeId: TId;
}) => {
  const { endUserId } = useParams();
  const { sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' } =
    useTanStackSearch({
      from: routeId,
      strict: false,
      track: searchParams => ({
        sortBy: 'sortBy' in searchParams ? searchParams?.sortBy : undefined,
        sortDir: 'sortDir' in searchParams ? searchParams?.sortDir : undefined,
      }),
    });
  const selectNextEndUserId = useCallback(
    (data: TEndUsers) => {
      if (!endUserId) return;

      const sorted = sort({ data, sortBy, sortDir });
      const nextEndUserIndex = sorted?.findIndex(endUser => endUser.id === endUserId) + 1;

      return sorted?.[nextEndUserIndex]?.id;
    },
    [endUserId, sortBy, sortDir],
  );

  return useSelectEndUsersQuery(selectNextEndUserId);
};
