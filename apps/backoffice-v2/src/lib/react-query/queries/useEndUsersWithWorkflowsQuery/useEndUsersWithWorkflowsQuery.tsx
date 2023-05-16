import { useEndUsersQuery } from '../useEndUsersQuery/useEndUsersQuery';
import {TUsers} from "../../../../api/types";

export const useEndUsersWithWorkflowsQuery = (users: TUsers) => {
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
