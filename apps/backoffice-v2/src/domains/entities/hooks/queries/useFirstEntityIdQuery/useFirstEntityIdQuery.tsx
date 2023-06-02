import { TRouteId } from '../../../../../common/types';
import { useCallback } from 'react';
import { sort } from '../../../../../common/hooks/useSort/sort';
import { useSelectEntitiesQuery } from '../useSelectEntitiesQuery/useSelectEntitiesQuery';
import { TEntities } from '../../../types';
import { useUsersQuery } from '../../../../users/hooks/queries/useUsersQuery/useUsersQuery';
import { z } from 'zod';
import { useZodSearchParams } from '../../../../../common/hooks/useZodSearchParams/useZodSearchParams';

export const useFirstEntityIdQuery = <TId extends TRouteId>({
  initialState,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: keyof TEntities[number];
  };
}) => {
  const [{ sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' }] =
    useZodSearchParams(
      z.object({
        sortBy: z.string().catch(''),
        sortDir: z.union([z.literal('asc'), z.literal('desc')]).catch('desc'),
      }),
    );
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
