import {
  GetUsersAssignedCasesStatsDto,
  GetUsersCaseResolvingStats,
  IUserCaseResolvingStats,
} from '@/domains/user/api/users-stats/users-stats.types';
import { request } from '@/lib/request';

export const fetchUsersResolvedCasesStats = async (
  query: GetUsersCaseResolvingStats,
): Promise<IUserCaseResolvingStats[]> => {
  const result = await request.get<IUserCaseResolvingStats[]>(
    '/metrics/users/users-resolved-cases-statistic',
    { params: query },
  );

  return result.data;
};

export const fetchUsersAssignedCasesStats = async (
  query: GetUsersAssignedCasesStatsDto,
): Promise<IUserCaseResolvingStats[]> => {
  const result = await request.get<IUserCaseResolvingStats[]>(
    `/metrics/users/users-assigned-cases-statistic`,
    {
      params: query,
    },
  );

  return result.data;
};
