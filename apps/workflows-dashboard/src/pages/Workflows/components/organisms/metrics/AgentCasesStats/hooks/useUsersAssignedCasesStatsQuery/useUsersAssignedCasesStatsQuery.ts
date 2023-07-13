import { usersStatsQueryKeys } from '@app/domains/user/api/users-stats';
import { useWorkflowFilters } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowFilters';
import { useQuery } from '@tanstack/react-query';

export const useUsersAssignedCasesStatsQuery = () => {
  const { filters } = useWorkflowFilters();
  const { data, isLoading } = useQuery({
    ...usersStatsQueryKeys.casesAssignedStats({
      // fromDate: filters.fromDate!,
    }),
    enabled: Boolean(filters.fromDate),
  });

  return {
    data,
    isLoading,
  };
};
