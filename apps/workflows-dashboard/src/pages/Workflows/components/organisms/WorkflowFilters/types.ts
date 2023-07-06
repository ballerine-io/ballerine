import {
  WorkflowFilterValues,
  WorkflowFiltersUpdater,
} from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';

export interface FilterComponentProps {
  filterValues: WorkflowFilterValues;
  onChange: WorkflowFiltersUpdater;
}

export type FilterComponent = React.ComponentType<FilterComponentProps>;
