import { FunctionComponent, useCallback, useMemo } from 'react';
import { TUsers } from '@/domains/users/types';
import { MultiSelect } from '@/common/components/atoms/MultiSelect/MultiSelect';
import { useFilter } from '@/common/hooks/useFilter/useFilter';
import { AlertStatuses, AlertTypes } from '@/domains/alerts/fetchers';

export const AlertsFilters: FunctionComponent<{
  assignees: TUsers;
  authenticatedUserId: string | null;
}> = ({ assignees, authenticatedUserId }) => {
  const assigneeOptions = useMemo(
    () =>
      assignees?.map(assignee => ({
        label: `${assignee?.fullName}${assignee?.id === authenticatedUserId ? ' (You)' : ''}`,
        value: assignee?.id,
      })) ?? [],
    [authenticatedUserId, assignees],
  );
  const alertTypeOptions = useMemo(
    () =>
      AlertTypes?.map(alertType => ({
        label: alertType,
        value: alertType,
      })) ?? [],
    [],
  );
  const statusOptions = useMemo(
    () =>
      AlertStatuses?.map(status => ({
        label: status,
        value: status,
      })) ?? [],
    [],
  );
  const filters = [
    {
      title: 'Assignee',
      accessor: 'assigneeId',
      options: [
        {
          label: 'Unassigned',
          value: null,
        },
        ...assigneeOptions,
      ],
    },
    {
      title: 'Alert Type',
      accessor: 'alertType',
      options: alertTypeOptions,
    },
    {
      title: 'Status',
      accessor: 'status',
      options: statusOptions,
    },
  ] satisfies Array<{
    title: string;
    accessor: string;
    options: Array<{
      label: string;
      value: string;
    }>;
  }>;
  const { filter, onFilter } = useFilter();
  const onClearSelect = useCallback(
    (accessor: string) => () => {
      onFilter(accessor)([]);
    },
    [onFilter],
  );

  return (
    <div>
      <h4 className={'leading-0 min-h-[16px] pb-7 text-xs font-bold'}>Filters</h4>
      <div className={`flex gap-x-2`}>
        {filters.map(({ title, accessor, options }) => (
          <MultiSelect
            key={title}
            title={title}
            accessor={accessor}
            onFilter={onFilter}
            selectedValues={filter?.[accessor] ?? []}
            onSelect={onFilter(accessor)}
            onClearSelect={onClearSelect(accessor)}
            options={options}
          />
        ))}
      </div>
    </div>
  );
};