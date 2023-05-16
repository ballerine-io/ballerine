import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';
import {TUser} from "../../../../api/types";

export const useEndUsersWithWorkflowsQuery = (users: TUser) => {
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
