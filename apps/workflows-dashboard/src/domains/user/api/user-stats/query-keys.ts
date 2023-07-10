import {
  fetchUserCaseResolvingStats,
  fetchUserStats,
} from '@app/domains/user/api/user-stats/user-stats.api';
import {
  GetUserCaseResolvingStatsDto,
  GetUserStatsDto,
} from '@app/domains/user/api/user-stats/user-stats.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const userStatsQueryKeys = createQueryKeys('user-stats', {
  userStats: (query: GetUserStatsDto) => ({
    queryKey: [query],
    queryFn: () => fetchUserStats(query),
  }),
  userCaseResolvingStats: (query: GetUserCaseResolvingStatsDto) => ({
    queryKey: [query],
    queryFn: () => fetchUserCaseResolvingStats(query),
  }),
});
