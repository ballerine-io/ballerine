import { FiltersUpdater } from '@/components/providers/FiltersProvider/filters-provider.types';
import { FilterComponent } from '@/pages/Workflows/components/organisms/WorkflowFilters/types';
import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';
import { memo } from 'react';

interface Props {
  values: WorkflowsFiltersValues;
  components: FilterComponent[];
  onChange: FiltersUpdater<WorkflowsFiltersValues>;
}

export const WorkflowFilters = memo(({ values, components, onChange }: Props) => {
  return (
    <div className="justify-betwesen flex">
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
