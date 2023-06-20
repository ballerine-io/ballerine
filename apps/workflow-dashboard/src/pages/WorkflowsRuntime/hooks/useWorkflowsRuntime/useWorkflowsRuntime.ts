import { workflowsRuntimeKeys } from '@app/domains/workflows-runtime';
import { WorkflowsRuntimeFilterValues } from '@app/pages/WorkflowsRuntime/hooks/useWorkflowsRuntimeFilters/types';
import { useQuery } from '@tanstack/react-query';

export function useWorkflowsRuntime(query: WorkflowsRuntimeFilterValues) {
  const {
    isFetching,
    isLoading,
    data = { results: [], totalItems: 0, totalPages: 0 },
  } = useQuery({
    ...workflowsRuntimeKeys.list(query),
    keepPreviousData: true,
  });

  return {
    isFetching,
    isLoading,
    data,
  };
}
