import { useEndUserQuery } from '../useEndUserQuery/useEndUserQuery';
import { useWorkflowsQuery } from '../useWorkflowsQuery/useWorkflowsQuery';

export const useEndUsersWithWorkflowQuery = (endUserId: string) => {
  const { data: activeWorkflows } = useWorkflowsQuery({ endUserId });

  return useEndUserQuery({
    endUserId,
    select: endUsers =>
      endUsers.map(endUser => ({
        ...endUser,
        activeWorkflows: activeWorkflows?.filter(workflow => workflow.endUserId === endUser.id),
      })),
  });
};
