import { useFilters } from '@/components/providers/FiltersProvider/hooks/useFilters';
import { usersStatsQueryKeys } from '@/domains/user/api/users-stats';
import { useQuery } from '@tanstack/react-query';

export const useUsersAssignedCasesStatsQuery = () => {
  const { filters } = useFilters();
  const { data, isLoading } = useQuery({
    ...usersStatsQueryKeys.casesAssignedStats({
      // fromDate: filters.fromDate!,
    }),
    // @ts-ignore
    enabled: Boolean(filters.fromDate),
  });

  return {
    data,
    isLoading,
  };
};
