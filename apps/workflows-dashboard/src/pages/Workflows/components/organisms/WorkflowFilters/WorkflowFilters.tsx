import { FilterComponent } from '@app/pages/Workflows/components/organisms/WorkflowFilters/types';
import { WorkflowsFilterValues } from '@app/pages/Workflows/hooks/useWorkflowsFilters/types';
import { memo } from 'react';

interface Props {
  values: WorkflowsFilterValues;
  components: FilterComponent[];
  onChange: (nextValues: WorkflowsFilterValues) => void;
}

export const WorkflowFilters = memo(({ values, components, onChange }: Props) => {
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
