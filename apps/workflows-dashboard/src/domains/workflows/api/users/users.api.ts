import { IUser } from '@/domains/auth/common/types';
import { GetActiveUsersDto } from '@/domains/workflows/api/users/users.types';
import { request } from '@/lib/request';

export const fetchActiveUsers = async (query: GetActiveUsersDto): Promise<IUser[]> => {
  const result = await request.get<IUser[]>('/metrics/users', { params: query });

  return result.data;
};
