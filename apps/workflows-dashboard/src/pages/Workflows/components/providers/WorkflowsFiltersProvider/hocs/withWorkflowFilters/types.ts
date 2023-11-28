import {
  WorkflowFilterValues,
  WorkflowFiltersUpdater,
} from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';

export interface WorkflowFiltersProps {
  filters: WorkflowFilterValues;
  updateFilters: WorkflowFiltersUpdater;
}
