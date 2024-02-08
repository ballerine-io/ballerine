import { FilterItem } from '@/pages/TransactionMonitoringAlerts/components/Filters/Filters.Item';
import { FunctionComponent, useMemo } from 'react';
import { TUsers } from '@/domains/users/types';

export const Filters: FunctionComponent<{
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
      assignees?.map(assignee => ({
        label: `${assignee?.fullName}${assignee?.id === authenticatedUserId ? ' (You)' : ''}`,
        value: assignee?.id,
      })) ?? [],
    [authenticatedUserId, assignees],
  );
  const statusOptions = useMemo(
    () =>
      assignees?.map(assignee => ({
        label: `${assignee?.fullName}${assignee?.id === authenticatedUserId ? ' (You)' : ''}`,
        value: assignee?.id,
      })) ?? [],
    [authenticatedUserId, assignees],
  );
  const filters = [
    {
      title: 'Assignee',
      options: [
        {
          label: 'All',
          value: '',
        },
        {
          label: 'Unassigned',
          value: null,
        },
        ...assigneeOptions,
      ],
    },
    {
      title: 'Alert Type',
      options: [
        {
          label: 'All',
          value: 'all',
        },
        ...alertTypeOptions,
      ],
    },
    {
      title: 'Status',
      options: [
        {
          label: 'All',
          value: 'all',
        },
        ...statusOptions,
      ],
    },
  ];

  return (
    <div>
      <h4 className={'leading-0 min-h-[16px] pb-2.5 text-xs font-bold'}>Filters</h4>
      <div className={`flex gap-x-2`}>
        {filters.map(({ title, options }) => (
          <FilterItem key={title} title={title} options={options} />
        ))}
      </div>
    </div>
  );
};
