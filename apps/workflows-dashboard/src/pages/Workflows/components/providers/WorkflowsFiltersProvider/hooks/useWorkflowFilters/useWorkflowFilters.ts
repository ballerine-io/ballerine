import { workflowsFilterContext } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.context';
import { useContext } from 'react';

export const useWorkflowFilters = () => useContext(workflowsFilterContext);
