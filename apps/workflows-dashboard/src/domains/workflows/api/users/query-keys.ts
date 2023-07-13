import { fetchActiveUsers } from '@app/domains/workflows/api/users/users.api';
import { GetActiveUsersDto } from '@app/domains/workflows/api/users/users.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const usersKeys = createQueryKeys('users', {
  activeUsers: (query: GetActiveUsersDto) => ({
    queryKey: [{}, query],
    queryFn: () => fetchActiveUsers(query),
  }),
});
