import { IUser } from '@app/domains/auth/common/types';
import { GetActiveUsersDto } from '@app/domains/workflows/api/users/users.types';
import { request } from '@app/lib/request';

export const fetchActiveUsers = async (query: GetActiveUsersDto): Promise<IUser[]> => {
  const result = await request.get<IUser[]>('/external/users/active-users', { params: query });

  return result.data;
};
