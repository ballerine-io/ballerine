import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/atoms/Select';
import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { FilterComponent } from '@app/pages/Workflows/components/organisms/WorkflowFilters/types';

export const StatusFilterComponent: FilterComponent = ({ filterValues, onChange }) => {
  return (
    <Select
      value={filterValues.status?.toString()}
      onValueChange={value => onChange({ status: [value] as IWorkflowStatus[] })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Pick status"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

StatusFilterComponent.displayName = 'StatusFilterComponent';
