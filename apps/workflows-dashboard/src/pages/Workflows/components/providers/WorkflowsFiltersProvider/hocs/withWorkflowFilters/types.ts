import {
  WorkflowFilterValues,
  WorkflowFiltersUpdater,
} from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';

export interface WorkflowFiltersProps {
  filters: WorkflowFilterValues;
  updateFilters: WorkflowFiltersUpdater;
}
