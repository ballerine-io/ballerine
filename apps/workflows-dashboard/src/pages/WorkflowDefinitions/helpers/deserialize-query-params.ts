import { WorkflowDefinitionsFilterValues } from '@/pages/WorkflowDefinitions/types/workflow-definitions-filter-values';
import { WorkflowDefinitionsQueryParams } from '@/pages/WorkflowDefinitions/types/workflow-definitions-query-params';

export const deserializeQueryParams = (query: WorkflowDefinitionsQueryParams) => {
  const filters: WorkflowDefinitionsFilterValues = {
    page: query.page as number,
    limit: query.limit as number,
    public: query.public as boolean,
  };

  return filters;
};
