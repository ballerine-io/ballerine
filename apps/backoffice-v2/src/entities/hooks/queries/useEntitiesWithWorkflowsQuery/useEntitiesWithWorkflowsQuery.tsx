import { useEntitiesQuery } from '../useEntitiesQuery/useEntitiesQuery';
import { TUsers } from '../../../../api/types';

export const useEntitiesWithWorkflowsQuery = (users: TUsers) => {
  return useEntitiesQuery({
    select: entities =>
      entities.map(entity => {
        const assigneeId = entity?.workflowRuntimeData?.assigneeId;

        return {
          ...entity,
          assigneeId,
          assigneeFullName: users?.find(user => user?.id === assigneeId)?.fullName,
          caseCreatedAt: entity?.workflowRuntimeData?.createdAt,
        };
      }),
  });
};
