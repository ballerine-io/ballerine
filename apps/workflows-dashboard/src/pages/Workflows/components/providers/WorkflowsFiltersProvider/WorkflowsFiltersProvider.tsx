import { deserializeQueryParams } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/helpers/deserializeQueryParams';
import { useWorkflowsQueryParams } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsQueryParams';
import {
  WorkflowFilterValues,
  WorkflowFiltersContext,
} from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';
import { useCallback, useMemo } from 'react';
import { workflowsFilterContext } from './workflows-filters.context';

const { Provider } = workflowsFilterContext;

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const WorkflowsFiltersProvider = ({ children }: Props) => {
  const { query, setQuery } = useWorkflowsQueryParams();

  const filterValues = useMemo(() => deserializeQueryParams(query), [query]);

  const updateFilters = useCallback(
    (filters: Partial<WorkflowFilterValues>) => {
      setQuery(filters);
    },
    [setQuery],
  );

  const context = useMemo(() => {
    const ctx: WorkflowFiltersContext = {
      filters: filterValues,
      updateFilters,
    };

    return ctx;
  }, [filterValues, updateFilters]);

  return <Provider value={context}>{children}</Provider>;
};
