import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';
import { TUsers } from '../../../../api/types';

export const useEndUsersWithWorkflowsQuery = (users: TUsers) => {
  return useEndUsersQuery({
    select: endUsers =>
      endUsers.map(endUser => {
        const assigneeId = endUser?.workflowRuntimeData?.assigneeId;
        console.log(endUser?.workflowRuntimeData);
        return {
          ...endUser,
          assigneeId,
          assigneeFullName: users?.find(user => user?.id === assigneeId)?.fullName,
          caseCreatedAt: endUser?.workflowRuntimeData?.createdAt,
        };
      }),
  });
};
