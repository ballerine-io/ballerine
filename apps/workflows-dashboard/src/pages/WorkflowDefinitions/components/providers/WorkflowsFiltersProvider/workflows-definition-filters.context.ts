import { WorkflowFiltersContext } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';
import { createContext } from 'react';

export const workflowDefinitionFiltersContext = createContext({} as WorkflowFiltersContext);
