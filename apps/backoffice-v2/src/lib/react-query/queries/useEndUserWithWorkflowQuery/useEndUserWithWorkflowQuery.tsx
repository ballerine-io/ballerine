import { useEndUserQuery } from '../useEndUserQuery/useEndUserQuery';
import { useWorkflowQuery } from '../useWorkflowQuery/useWorkflowQuery';
import { useWorkflowsQuery } from '../useWorkflowsQuery/useWorkflowsQuery';

export const useEndUserWithWorkflowQuery = (endUserId: string) => {
  const workflowId = useWorkflowsQuery()?.data?.find(
    workflow => workflow.endUserId === endUserId,
  )?.id;
  const { data: workflow } = useWorkflowQuery({ workflowId });

  return useEndUserQuery({
    endUserId,
    select: endUser => ({
      ...endUser,
      workflow,
    }),
  });
};
