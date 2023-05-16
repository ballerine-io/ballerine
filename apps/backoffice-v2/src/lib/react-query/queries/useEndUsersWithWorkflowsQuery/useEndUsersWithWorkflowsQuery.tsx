import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';
import { useWorkflowsQuery } from '../useWorkflowsQuery/useWorkflowsQuery';

export const useEndUsersWithWorkflowsQuery = () => {
  return useEndUsersQuery({
    select: endUsers =>
      endUsers.map(endUser => {
        return {
          ...endUser,
          assigneeId: endUser.workflowRuntimeData?.assigneeId,
        };
      }),
  });
};
