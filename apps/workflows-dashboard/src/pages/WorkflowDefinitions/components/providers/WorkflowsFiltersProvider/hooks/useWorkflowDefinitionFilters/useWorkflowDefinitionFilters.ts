import { workflowDefinitionFiltersContext } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/workflows-definition-filters.context';
import { useContext } from 'react';

export const useWorkflowDefinitionFilters = () => useContext(workflowDefinitionFiltersContext);
