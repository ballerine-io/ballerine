import { workflowsKeys } from '@app/domains/workflows';
import { WorkflowsFilterValues } from '@app/pages/Workflows/hooks/useWorkflowsFilters/types';
import { useQuery } from '@tanstack/react-query';

export function useWorkflows(query: WorkflowsFilterValues) {
  const {
    isFetching,
    isLoading,
    data = { results: [], totalItems: 0, totalPages: 0 },
  } = useQuery({
    ...workflowsKeys.list(query),
    keepPreviousData: true,
  });

  return {
    isFetching,
    isLoading,
    data,
  };
}
