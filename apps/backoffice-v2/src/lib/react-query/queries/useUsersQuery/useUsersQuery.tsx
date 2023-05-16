import { useQuery } from '@tanstack/react-query';
import { users } from '../../users';
import {TUser} from "../../../../api/types";

export const useUsersQuery = <TQueryFnData,>(
  select: (data: {users: TUser}) => TQueryFnData,
) => {
  return useQuery(users.list());
};
