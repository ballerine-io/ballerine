import { FacetedFilter, FacetedFilterOption } from '@app/components/molecules/FacetedFilter';
import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
// import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { FilterComponent } from '@app/pages/Workflows/components/organisms/WorkflowFilters/types';

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
