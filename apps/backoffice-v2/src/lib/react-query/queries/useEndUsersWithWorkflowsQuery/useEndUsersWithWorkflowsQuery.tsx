import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';
import { TUsers } from '../../../../api/types';
import { env } from '../../../../env/env';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useEndUsersWithWorkflowsQuery = (users: TUsers) => {
  const isAuthenticated = useIsAuthenticated();

  return useEndUsersQuery({
    select: endUsers =>
      endUsers.map(endUser => {
        const assigneeId = endUser?.workflowRuntimeData?.assigneeId;

        return {
          ...endUser,
          assigneeId,
          assigneeFullName: users?.find(user => user?.id === assigneeId)?.fullName,
          caseCreatedAt: endUser?.workflowRuntimeData?.createdAt,
          caseStatus: endUser?.workflowRuntimeData?.status,
        };
      }),
    enabled: isAuthenticated,
    refetchInterval: env.VITE_ASSIGNMENT_POLLING_INTERVAL,
  });
};
