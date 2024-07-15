import { useWorkflowDefinitionFilters } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowDefinitionFilters';
import { useWorkflowDefinitionsQuery } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsQuery';
import { useCallback } from 'react';

export const useWorkflowDefinitionsPagination = () => {
  const { filters, updateFilters } = useWorkflowDefinitionFilters();
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
