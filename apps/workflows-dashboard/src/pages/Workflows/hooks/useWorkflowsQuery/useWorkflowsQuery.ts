import { SortingParams } from '@/common/types/sorting-params.types';
import { workflowKeys } from '@/domains/workflows';
import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';
import { useQuery } from '@tanstack/react-query';

export function useWorkflowsQuery(query: WorkflowsFiltersValues, sortingParams?: SortingParams) {
  const {
    isFetching,
    isLoading,
    data = { results: [], meta: { pages: 0, total: 0 } },
  } = useQuery({
    ...workflowKeys.list(query, sortingParams || {}),
    // @ts-ignore
    keepPreviousData: true,
  });

  return {
    isFetching,
    isLoading,
    data,
  };
}
