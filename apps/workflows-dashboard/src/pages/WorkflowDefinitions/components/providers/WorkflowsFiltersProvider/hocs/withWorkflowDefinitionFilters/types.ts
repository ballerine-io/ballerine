import {
  WorkflowFilterValues,
  WorkflowFiltersUpdater,
} from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';

export interface WorkflowDefinitionFiltersProps {
  filters: WorkflowFilterValues;
  updateFilters: WorkflowFiltersUpdater;
}
