import { WorkflowsQueryParams } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsQueryParams/types';
import { WorkflowFilterValues } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';

export const deserializeQueryParams = (query: WorkflowsQueryParams): WorkflowFilterValues => {
  const filters: WorkflowFilterValues = {
    page: query.page,
    limit: query.limit,
    fromDate: query.fromDate,
    orderBy: query.orderBy,
    orderDirection: query.orderDirection as 'asc' | 'desc',
    status: Array.isArray(query.status)
      ? (query.status as WorkflowFilterValues['status'])
      : undefined,
  };

  return filters;
};
