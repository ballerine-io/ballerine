import { MultiSelect } from '@/common/components/atoms/MultiSelect/MultiSelect';
import { useFilter } from '@/common/hooks/useFilter/useFilter';
import { keyFactory } from '@/common/utils/key-factory/key-factory';
import { AlertStatuses } from '@/domains/alerts/fetchers';
import { TUsers } from '@/domains/users/types';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { titleCase } from 'string-ts';

export const AlertsFilters: FunctionComponent<{
  assignees: TUsers;
  labels: string[];
  authenticatedUserId: string | null;
}> = ({ assignees, labels, authenticatedUserId }) => {
  const assigneeOptions = useMemo(
    () =>
      assignees?.map(assignee => ({
        label: `${assignee?.fullName}${assignee?.id === authenticatedUserId ? ' (You)' : ''}`,
        value: assignee?.id,
      })) ?? [],
    [authenticatedUserId, assignees],
  );
  const statusOptions = useMemo(
    () =>
      AlertStatuses?.map(status => ({
        label: titleCase(status),
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
      title: 'Status',
      accessor: 'status',
      options: statusOptions,
    },
    {
      title: 'Label',
      accessor: 'label',
      options: labels.map(label => ({
        label,
        value: label,
      })),
    },
  ] satisfies Array<{
    title: string;
    accessor: string;
    options: Array<{
      label: string;
      value: string | null;
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
            key={keyFactory(title, filter?.[accessor])}
            title={title}
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
