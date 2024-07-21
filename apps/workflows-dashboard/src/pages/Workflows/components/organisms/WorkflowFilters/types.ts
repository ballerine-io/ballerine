import { FiltersUpdater } from '@/components/providers/FiltersProvider/filters-provider.types';
import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';

export interface FilterComponentProps {
  filterValues: WorkflowsFiltersValues;
  onChange: FiltersUpdater<WorkflowsFiltersValues>;
}

export type FilterComponent = React.ComponentType<FilterComponentProps>;
