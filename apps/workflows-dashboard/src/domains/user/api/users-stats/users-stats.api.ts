import {
  GetUsersCaseResolvingStats,
  IUserCaseResolvingStats,
} from '@app/domains/user/api/users-stats/users-stats.types';
import { request } from '@app/lib/request';

export const fetchUsersCaseResolvingStats = async (
  query: GetUsersCaseResolvingStats,
): Promise<IUserCaseResolvingStats[]> => {
  const result = await request.get<IUserCaseResolvingStats[]>(
    '/external/users/metrics/case-resolving-stats',
    { params: query },
  );

  return result.data;
};
