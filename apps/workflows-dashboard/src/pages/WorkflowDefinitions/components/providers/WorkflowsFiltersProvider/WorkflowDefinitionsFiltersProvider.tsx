import { deserializeQueryParams } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/helpers/deserializeQueryParams';
import { useWorkflowsDefinitionQueryParams } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsDefinitionQueryParams';
import { workflowDefinitionFiltersContext } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/workflows-definition-filters.context';

import {
  WorkflowDefinitionFiltersContext,
  WorkflowDefinitionsFilterValues,
} from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/workflows-definition-filters.types';
import { useCallback, useMemo } from 'react';

const { Provider } = workflowDefinitionFiltersContext;

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const WorkflowDefinitionsFiltersProvider = ({ children }: Props) => {
  const { query, setQuery } = useWorkflowsDefinitionQueryParams();
  const filterValues = useMemo(() => deserializeQueryParams(query), [query]);

  const updateFilters = useCallback(
    (filters: Partial<WorkflowDefinitionsFilterValues>) => {
      setQuery(filters);
    },
    [setQuery],
  );

  const context = useMemo(() => {
    const ctx: WorkflowDefinitionFiltersContext = {
      filters: filterValues,
      updateFilters,
    };

    return ctx;
  }, [filterValues, updateFilters]);

  return <Provider value={context}>{children}</Provider>;
};
