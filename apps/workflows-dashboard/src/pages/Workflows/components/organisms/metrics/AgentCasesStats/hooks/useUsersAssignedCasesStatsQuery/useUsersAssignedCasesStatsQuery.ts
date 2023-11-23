import { usersStatsQueryKeys } from '@/domains/user/api/users-stats';
import { useWorkflowFilters } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowFilters';
import { useQuery } from '@tanstack/react-query';

export const useUsersAssignedCasesStatsQuery = () => {
  const { filters } = useWorkflowFilters();
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
