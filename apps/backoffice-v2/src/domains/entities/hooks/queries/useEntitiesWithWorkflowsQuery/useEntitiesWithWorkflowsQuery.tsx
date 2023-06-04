import { useEntitiesQuery } from '../useEntitiesQuery/useEntitiesQuery';
import { TUsers } from '../../../../users/types';
import { env } from '../../../../../common/env/env';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useEntitiesWithWorkflowsQuery = (users: TUsers) => {
  const isAuthenticated = useIsAuthenticated();

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
    enabled: isAuthenticated,
    refetchInterval: env.VITE_ASSIGNMENT_POLLING_INTERVAL,
  });
};
