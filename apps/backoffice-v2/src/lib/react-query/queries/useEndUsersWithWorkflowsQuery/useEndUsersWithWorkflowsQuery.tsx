import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';
import { useWorkflowsQuery } from '../useWorkflowsQuery/useWorkflowsQuery';

export const useEndUsersWithWorkflowsQuery = () => {
  const { data: workflows } = useWorkflowsQuery();

  return useEndUsersQuery({
    select: endUsers =>
      endUsers.map(endUser => ({
        ...endUser,
        workflows: workflows?.filter(workflow => workflow?.endUserId === endUser?.id),
      })),
  });
};
