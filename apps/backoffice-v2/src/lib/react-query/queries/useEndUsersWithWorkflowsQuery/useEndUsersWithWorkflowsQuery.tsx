import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';
import { useWorkflowsQuery } from '../useWorkflowsQuery/useWorkflowsQuery';

export const useEndUsersWithWorkflowsQuery = () => {
  const { data: workflows } = useWorkflowsQuery();

  return useEndUsersQuery({
    select: endUsers =>
      endUsers.map(endUser => ({
        ...endUser,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        workflows: workflows?.filter(workflow => workflow.endUserId === endUser.id),
        assignedTo: workflows
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ?.map(workflow => workflow.assigneeId)
          .filter((value, index, assignees) => assignees.indexOf(value) === index),
      })),
  });
};
