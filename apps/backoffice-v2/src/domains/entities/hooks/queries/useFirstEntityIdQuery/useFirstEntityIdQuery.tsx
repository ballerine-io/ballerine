import { useCallback } from 'react';
import { sort } from '../../../../../common/hooks/useSort/sort';
import { useSelectEntitiesQuery } from '../useSelectEntitiesQuery/useSelectEntitiesQuery';
import { TEntities } from '../../../types';
import { useUsersQuery } from '../../../../users/hooks/queries/useUsersQuery/useUsersQuery';
import { useSearchParamsByEntity } from '../../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';

export const useFirstEntityIdQuery = ({
  initialState,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: keyof TEntities[number];
  };
}) => {
  const [{ sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' }] =
    useSearchParamsByEntity();
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
