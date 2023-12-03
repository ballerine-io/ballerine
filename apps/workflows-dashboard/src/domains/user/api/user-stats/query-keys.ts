import {
  fetchUserDailyCasesResolvedStats,
  fetchUserStats,
} from '@/domains/user/api/user-stats/user-stats.api';
import {
  GetUserDailyCasesResolvedStatsDto,
  GetUserStatsDto,
} from '@/domains/user/api/user-stats/user-stats.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const userStatsQueryKeys = createQueryKeys('user-stats', {
  userStats: (query: GetUserStatsDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchUserStats(query),
  }),
  userDailyCasesResolvedStats: (query: GetUserDailyCasesResolvedStatsDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchUserDailyCasesResolvedStats(query),
  }),
});
