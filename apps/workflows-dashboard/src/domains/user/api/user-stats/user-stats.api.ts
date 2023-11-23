import {
  GetUserDailyCasesResolvedStatsDto,
  GetUserStatsDto,
  IResolvedCasesDailyMetric,
  IUserStats,
  UserStats,
} from '@/domains/user/api/user-stats/user-stats.types';
import { request } from '@/lib/request';

export const fetchUserStats = async (query: GetUserStatsDto): Promise<UserStats> => {
  const result = await request.get<IUserStats>(`/metrics/users/workflow-processing-statistic`, {
    params: query,
  });

  const { approvalRate, averageAssignmentTime, averageResolutionTime, averageReviewTime } =
    result.data || ({} as IUserStats);

  const userStats: UserStats = {
    approvalRate: parseFloat(approvalRate),
    averageAssignmentTime: parseInt(averageAssignmentTime),
    averageResolutionTime: parseInt(averageResolutionTime),
    averageReviewTime: parseInt(averageReviewTime),
  };

  return userStats;
};

export const fetchUserDailyCasesResolvedStats = async (
  query: GetUserDailyCasesResolvedStatsDto,
): Promise<IResolvedCasesDailyMetric[]> => {
  const result = await request.get<IResolvedCasesDailyMetric[]>(
    `/metrics/users/cases-resolved-daily`,
    { params: query },
  );

  return result.data;
};
