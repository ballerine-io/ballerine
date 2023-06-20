import { WorkflowsRuntimeFilterValues } from '@app/pages/WorkflowsRuntime/hooks/useWorkflowsRuntimeFilters/types';

export interface FilterComponentProps {
  filterValues: Partial<WorkflowsRuntimeFilterValues>;
  onChange: (value: Partial<WorkflowsRuntimeFilterValues>) => void;
}

export type FilterComponent = React.ComponentType<FilterComponentProps>;
