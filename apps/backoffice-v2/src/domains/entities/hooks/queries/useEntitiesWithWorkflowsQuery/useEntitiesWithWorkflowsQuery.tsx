import { useEntitiesQuery } from '../useEntitiesQuery/useEntitiesQuery';
import { TUsers } from '../../../../users/types';
import { env } from '../../../../../common/env/env';

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
          caseStatus: entity?.workflowRuntimeData?.status,
        };
      }),
    refetchInterval: env.VITE_ASSIGNMENT_POLLING_INTERVAL,
  });
};
