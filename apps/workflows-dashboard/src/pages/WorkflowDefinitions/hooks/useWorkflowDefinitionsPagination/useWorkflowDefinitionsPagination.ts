import { useFilters } from '@/components/providers/FiltersProvider/hooks/useFilters';
import { useWorkflowDefinitionsQuery } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsQuery';
import { WorkflowDefinitionsFilterValues } from '@/pages/WorkflowDefinitions/types/workflow-definitions-filter-values';
import { useCallback } from 'react';

export const useWorkflowDefinitionsPagination = () => {
  const { filters, updateFilters } = useFilters<WorkflowDefinitionsFilterValues>();
  const { data } = useWorkflowDefinitionsQuery(filters);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateFilters({ page: nextPage });
    },
    [updateFilters],
  );

  return {
    handlePageChange,
    total: data?.meta.pages || 1,
    page: filters.page || 1,
  };
};
