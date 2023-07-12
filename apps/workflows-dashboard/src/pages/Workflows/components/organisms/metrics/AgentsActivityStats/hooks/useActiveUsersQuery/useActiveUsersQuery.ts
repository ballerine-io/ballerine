import { usersKeys } from '@app/domains/workflows/api/users';
import { useWorkflowFilters } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowFilters';
import { useQuery } from '@tanstack/react-query';

export const useActiveUsersQuery = () => {
  const { filters } = useWorkflowFilters();
  const { data = [], isLoading } = useQuery({
    ...usersKeys.activeUsers({ fromDate: filters.fromDate! }),
    enabled: Boolean(filters.fromDate),
  });

  return {
    data,
    isLoading,
  };
};
