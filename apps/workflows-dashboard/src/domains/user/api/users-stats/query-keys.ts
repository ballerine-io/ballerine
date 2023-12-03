import {
  fetchUsersAssignedCasesStats,
  fetchUsersResolvedCasesStats,
} from '@/domains/user/api/users-stats/users-stats.api';
import {
  GetUsersAssignedCasesStatsDto,
  GetUsersCaseResolvingStats,
} from '@/domains/user/api/users-stats/users-stats.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const usersStatsQueryKeys = createQueryKeys('users-stats', {
  casesResolvedStats: (query: GetUsersCaseResolvingStats) => ({
    queryKey: [{ query }],
    queryFn: () => fetchUsersResolvedCasesStats(query),
  }),
  casesAssignedStats: (query: GetUsersAssignedCasesStatsDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchUsersAssignedCasesStats(query),
  }),
});
