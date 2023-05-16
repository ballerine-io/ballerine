import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';

export const useEndUsersWithWorkflowsQuery = users => {
  return useEndUsersQuery({
    select: endUsers =>
      endUsers.map(endUser => {
        const assigneeId = endUser.workflowRuntimeData?.assigneeId;

        return {
          ...endUser,
          assigneeId: assigneeId,
          assigneeFullName: users?.find(user => user.id == assigneeId)?.fullName,
        };
      }),
  });
};
