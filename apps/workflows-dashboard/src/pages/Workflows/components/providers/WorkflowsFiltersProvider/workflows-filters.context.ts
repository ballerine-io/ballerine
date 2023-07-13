import { WorkflowFiltersContext } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';
import { createContext } from 'react';

export const workflowsFilterContext = createContext({} as WorkflowFiltersContext);
