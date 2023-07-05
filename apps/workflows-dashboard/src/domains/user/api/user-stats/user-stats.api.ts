import {
  GetUserDailyCasesResolvedStatsDto,
  GetUserStatsDto,
  IResolvedCasesDailyMetric,
  IUserStats,
} from '@app/domains/user/api/user-stats/user-stats.types';
import { request } from '@app/lib/request';

export const fetchUserStats = async (query: GetUserStatsDto): Promise<IUserStats> => {
  const { userId, ...restQuery } = query;

  const result = await request.get<IUserStats>(
    `/metrics/users/${userId}/user-workflow-processing-statistic`,
    {
      params: restQuery,
    },
  );

  return result.data;
};

export const fetchUserDailyCasesResolvedStats = async (
  query: GetUserDailyCasesResolvedStatsDto,
): Promise<IResolvedCasesDailyMetric[]> => {
  const { userId, ...restQuery } = query;

  const result = await request.get<IResolvedCasesDailyMetric[]>(
    `/metrics/users/${userId}/user-cases-resolved-daily`,
    { params: restQuery },
  );

  return result.data;
};
