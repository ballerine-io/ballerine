import { SortingParams } from '@app/common/types/sorting-params.types';
import { workflowKeys } from '@app/domains/workflows';
import { WorkflowsFilterValues } from '@app/pages/Workflows/hooks/useWorkflowsFilters/types';
import { useQuery } from '@tanstack/react-query';

export function useWorkflows(query: WorkflowsFilterValues, sortingParams?: SortingParams) {
  const {
    isFetching,
    isLoading,
    data = { results: [], meta: { pages: 0, total: 0 } },
  } = useQuery({
    ...workflowKeys.list(query, sortingParams || {}),
    keepPreviousData: true,
  });

  return {
    isFetching,
    isLoading,
    data,
  };
}
