import { fetchUsersCaseResolvingStats } from '@app/domains/user/api/users-stats/users-stats.api';
import { GetUsersCaseResolvingStats } from '@app/domains/user/api/users-stats/users-stats.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const usersStatsQueryKeys = createQueryKeys('users-stats', {
  caseResolvingStatsList: (query: GetUsersCaseResolvingStats) => ({
    queryKey: [query],
    queryFn: () => fetchUsersCaseResolvingStats(query),
  }),
});
