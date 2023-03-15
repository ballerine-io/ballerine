import { useEndUserQuery } from '../useEndUserQuery/useEndUserQuery';
import { useWorkflowQuery } from '../useWorkflowQuery/useWorkflowQuery';

export const useEndUsersWithWorkflowQuery = (endUserId: string) => {
  const { data: activeWorkflow } = useWorkflowsQuery({ endUserId });

  return useEndUserQuery({
    endUserId,
    select: endUser => ({
      ...endUser,
      activeWorkflow,
    }),
  });
};
