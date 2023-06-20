import { FilterComponent } from '@app/pages/WorkflowsRuntime/components/molecules/WorkflowRuntimeFilters/types';
import { WorkflowsRuntimeFilterValues } from '@app/pages/WorkflowsRuntime/hooks/useWorkflowsRuntimeFilters/types';
import { memo } from 'react';

interface Props {
  values: WorkflowsRuntimeFilterValues;
  components: FilterComponent[];
  onChange: (nextValues: WorkflowsRuntimeFilterValues) => void;
}

export const WorkflowRuntimeFilters = memo(({ values, components, onChange }: Props) => {
  return (
    <div className="flex justify-between">
      {components.map(Component => {
        return (
          <div className="w-1/4" key={`filter-component-${Component.displayName}`}>
            <Component filterValues={values} onChange={onChange} />
          </div>
        );
      })}
    </div>
  );
});
