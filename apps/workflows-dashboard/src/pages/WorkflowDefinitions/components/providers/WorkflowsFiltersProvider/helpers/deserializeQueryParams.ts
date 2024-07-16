import { WorkflowsDefinitionQueryParams } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsDefinitionQueryParams/types';
import { WorkflowDefinitionsFilterValues } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/workflows-definition-filters.types';

export const deserializeQueryParams = (query: WorkflowsDefinitionQueryParams) => {
  const filters: WorkflowDefinitionsFilterValues = {
    page: query.page,
    limit: query.limit,
    public: query.public,
  };

  return filters;
};
