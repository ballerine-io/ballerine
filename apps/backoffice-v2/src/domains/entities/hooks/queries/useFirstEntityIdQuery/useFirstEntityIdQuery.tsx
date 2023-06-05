import { TRouteId } from '../../../../../common/types';
import { useSearch as useTanStackSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { sort } from '../../../../../common/hooks/useSort/sort';
import { useSelectEntitiesQuery } from '../useSelectEntitiesQuery/useSelectEntitiesQuery';
import { TEntities } from '../../../types';
import { useUsersQuery } from '../../../../users/hooks/queries/useUsersQuery/useUsersQuery';

export const useFirstEntityIdQuery = <TId extends TRouteId>({
  initialState,
  routeId,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: keyof TEntities[number];
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
  const selectFirstEntityId = useCallback(
    (entities: TEntities) => {
      return sort({
        data: entities.map(entity => {
          const assigneeId = entity?.workflowRuntimeData?.assigneeId;

          return {
            ...entity,
            assigneeId,
            assigneeFullName: users?.find(user => user?.id === assigneeId)?.fullName,
            caseCreatedAt: entity?.workflowRuntimeData?.createdAt,
          };
        }),
        sortBy,
        sortDir,
      })?.[0]?.id;
    },
    [sortDir, sortBy, users],
  );

  return useSelectEntitiesQuery(selectFirstEntityId);
};
