import {
  GetUserCaseResolvingStatsDto,
  GetUserStatsDto,
  IResolvedCasesDailyMetric,
  IUserStats,
} from '@app/domains/user/api/user-stats/user-stats.types';
import { request } from '@app/lib/request';

export const fetchUserStats = async (query: GetUserStatsDto): Promise<IUserStats> => {
  const result = await request.get<IUserStats>('/external/workflows/metrics/user-stats', {
    params: query,
  });

  return result.data;
};

export const fetchUserCaseResolvingStats = async (
  query: GetUserCaseResolvingStatsDto,
): Promise<IResolvedCasesDailyMetric[]> => {
  const result = await request.get<IResolvedCasesDailyMetric[]>(
    '/external/workflows/metrics/case-resolving',
    {
      params: query,
    },
  );

  return result.data;
};
