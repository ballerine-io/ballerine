import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { WorkflowsFilterValues } from '@app/pages/Workflows/hooks/useWorkflowsFilters/types';
import { useCallback, useMemo } from 'react';
import { useQueryParams, NumberParam, withDefault, ArrayParam } from 'use-query-params';

export function useWorkflowsFilters() {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 25),
    status: withDefault(ArrayParam, [] as IWorkflowStatus[]),
  });

  const filters = useMemo(() => {
    const filters: WorkflowsFilterValues = {
      status: query.status ? (query.status as IWorkflowStatus[]) : undefined,
      limit: query.limit,
      page: query.page,
    };

    return filters;
  }, [query]);

  const setFilters = useCallback(
    (query: WorkflowsFilterValues) => {
      const isShouldResetPagination = filters.page === query.page;

      setQuery({ ...query, page: isShouldResetPagination ? 1 : query.page });
    },
    [filters, setQuery],
  );

  return {
    filters,
    setFilters,
  };
}
