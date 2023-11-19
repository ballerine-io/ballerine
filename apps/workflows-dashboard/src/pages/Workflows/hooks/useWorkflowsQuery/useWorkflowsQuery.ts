import { SortingParams } from '@/common/types/sorting-params.types';
import { workflowKeys } from '@/domains/workflows';
import { WorkflowFilterValues } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';
import { useQuery } from '@tanstack/react-query';

export function useWorkflowsQuery(query: WorkflowFilterValues, sortingParams?: SortingParams) {
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
