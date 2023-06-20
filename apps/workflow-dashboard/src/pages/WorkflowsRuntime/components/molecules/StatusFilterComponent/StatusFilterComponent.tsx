import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/atoms/Select';
import { IWorkflowRuntimeStatus } from '@app/domains/workflows-runtime/api/workflows-runtime';
import { FilterComponent } from '@app/pages/WorkflowsRuntime/components/organisms/WorkflowRuntimeFilters/types';

export const StatusFilterComponent: FilterComponent = ({ filterValues, onChange }) => {
  return (
    <Select
      value={filterValues.status}
      onValueChange={value => onChange({ status: value as IWorkflowRuntimeStatus })}
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
