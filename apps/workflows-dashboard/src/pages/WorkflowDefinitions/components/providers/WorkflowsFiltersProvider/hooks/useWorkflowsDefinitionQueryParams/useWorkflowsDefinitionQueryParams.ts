import { WorkflowsDefinitionQueryParams } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsDefinitionQueryParams/types';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';

export function useWorkflowsDefinitionQueryParams() {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 20),
  });

  return {
    query: query as WorkflowsDefinitionQueryParams,
    setQuery,
  };
}
