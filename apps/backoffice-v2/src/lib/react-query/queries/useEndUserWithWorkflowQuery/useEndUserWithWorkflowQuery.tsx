import { useEndUserQuery } from '../useEndUserQuery/useEndUserQuery';
import { useWorkflowQuery } from '../useWorkflowQuery/useWorkflowQuery';

export const useEndUserWithWorkflowQuery = (endUserId: string) => {
  const { data: workflow } = useWorkflowQuery({ endUserId });

  return useEndUserQuery({
    endUserId,
    select: endUser => ({
      ...endUser,
      workflow,
    }),
  });
};
