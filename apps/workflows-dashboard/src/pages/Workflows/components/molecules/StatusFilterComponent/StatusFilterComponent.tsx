import { FacetedFilter, FacetedFilterOption } from '@/components/molecules/FacetedFilter';
import { IWorkflowStatus } from '@/domains/workflows/api/workflow';
import { FilterComponent } from '@/pages/Workflows/components/organisms/WorkflowFilters/types';

const options: FacetedFilterOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Failed', value: 'failed' },
  { label: 'Completed', value: 'completed' },
];

export const StatusFilterComponent: FilterComponent = ({ filterValues, onChange }) => {
  return (
    <FacetedFilter
      value={filterValues.status || []}
      title="Status"
      options={options}
      onChange={updatedValue => onChange({ status: updatedValue as IWorkflowStatus[] })}
    />
  );
};

StatusFilterComponent.displayName = 'StatusFilterComponent';
