import { WorkflowsFilterValues } from '@app/pages/Workflows/hooks/useWorkflowsFilters/types';

export interface FilterComponentProps {
  filterValues: Partial<WorkflowsFilterValues>;
  onChange: (value: Partial<WorkflowsFilterValues>) => void;
}

export type FilterComponent = React.ComponentType<FilterComponentProps>;
