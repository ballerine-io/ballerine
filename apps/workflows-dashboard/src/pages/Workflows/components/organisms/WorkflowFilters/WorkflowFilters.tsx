import { FilterComponent } from '@/pages/Workflows/components/organisms/WorkflowFilters/types';
import {
  WorkflowFilterValues,
  WorkflowFiltersUpdater,
} from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/workflows-filters.types';
import { memo } from 'react';

interface Props {
  values: WorkflowFilterValues;
  components: FilterComponent[];
  onChange: WorkflowFiltersUpdater;
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
