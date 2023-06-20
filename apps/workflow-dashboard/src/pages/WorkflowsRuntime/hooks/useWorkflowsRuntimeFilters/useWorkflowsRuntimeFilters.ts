import { IWorkflowRuntimeStatus } from '@app/domains/workflows-runtime/api/workflows-runtime';
import { WorkflowsRuntimeFilterValues } from '@app/pages/WorkflowsRuntime/hooks/useWorkflowsRuntimeFilters/types';
import { useCallback, useMemo } from 'react';
import { useQueryParams, StringParam, NumberParam, withDefault } from 'use-query-params';

export function useWorkflowsRuntimeFilters() {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 25),
    status: StringParam,
  });

  const filters = useMemo(() => {
    const filters: WorkflowsRuntimeFilterValues = {
      status: query.status ? (query.status as IWorkflowRuntimeStatus) : undefined,
      limit: query.limit,
      page: query.page,
    };

    return filters;
  }, [query]);

  const setFilters = useCallback(
    (query: WorkflowsRuntimeFilterValues) => {
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
