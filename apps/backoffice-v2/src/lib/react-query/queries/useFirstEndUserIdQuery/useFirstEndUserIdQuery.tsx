import { TRouteId } from '../../../../types';
import { useSearch as useTanStackSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { sort } from 'hooks/useSort/sort';
import { TEndUsers } from '../../../../api/types';
import { useSelectEndUsersQuery } from '../useSelectEndUsersQuery/useSelectEndUsersQuery';
import { useUsersQuery } from '../useUsersQuery/useUsersQuery';

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
  const { data: users } = useUsersQuery();
  const selectFirstEndUserId = useCallback(
    (endUsers: TEndUsers) => {
      return sort({
        data: endUsers.map(endUser => {
          const assigneeId = endUser?.workflowRuntimeData?.assigneeId;

          return {
            ...endUser,
            assigneeId,
            assigneeFullName: users?.find(user => user?.id === assigneeId)?.fullName,
            caseCreatedAt: endUser?.workflowRuntimeData?.createdAt,
          };
        }),
        sortBy,
        sortDir,
      })?.[0]?.id;
    },
    [sortDir, sortBy, users],
  );

  return useSelectEndUsersQuery(selectFirstEndUserId);
};
