import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';
import { WorkflowsQueryParams } from '@/pages/Workflows/types/workflows-query-params';

export const deserializeQueryParams = (query: WorkflowsQueryParams): WorkflowsFiltersValues => {
  const filters: WorkflowsFiltersValues = {
    page: query.page,
    limit: query.limit,
    fromDate: query.fromDate,
    status: Array.isArray(query.status)
      ? (query.status as WorkflowsFiltersValues['status'])
      : undefined,
  };

  return filters;
};
