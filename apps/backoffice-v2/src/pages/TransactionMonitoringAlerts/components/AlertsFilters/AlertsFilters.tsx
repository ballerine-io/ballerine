import { Filters } from '@/common/components/organisms/Filters/Filters';
import { FiltersHeader } from '@/common/components/organisms/Filters/Filters.Header';
import { FiltersList } from '@/common/components/organisms/Filters/Filters.List';
import { FiltersInput } from '@/common/components/organisms/Filters/Filters.input';
import { IFilterDefinition, IFilterValue } from '@/common/components/organisms/Filters/interfaces';
import { TFiltersInputID } from '@/common/components/organisms/Filters/types';
import { useFilter } from '@/common/hooks/useFilter/useFilter';
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
  const filters: IFilterDefinition[] = useMemo(
    () => [
      {
        id: 'assigneeId',
        label: 'Assignee',
        type: 'multi-select',
        params: {
          options: [
            {
              label: 'Unassigned',
              value: null,
            },
            ...assigneeOptions,
          ],
        },
      },
      {
        id: 'status',
        label: 'Status',
        type: 'multi-select',
        params: {
          options: statusOptions,
        },
      },
      {
        label: 'Label',
        id: 'label',
        type: 'multi-select',
        params: {
          options: labels.map(label => ({
            label,
            value: label,
          })),
        },
      },
    ],
    [assigneeOptions, labels, statusOptions],
  );
  console.log('filters', filters);
  const { filter, onFilter } = useFilter();
  const filterValues = useMemo(
    () => Object.entries(filter || {}).map(([key, value]) => ({ id: key, value })),
    [filter],
  );

  const onClearSelect = useCallback(
    (filterId: TFiltersInputID) => () => {
      onFilter(filterId)([]);
    },
    [onFilter],
  );

  const onFilterChange = useCallback(
    (filterValue: IFilterValue) => {
      onFilter(filterValue.id)(filterValue.value as Array<string | null>);
    },
    [onFilter],
  );

  return (
    <Filters
      filters={filters}
      values={filterValues}
      onClear={onClearSelect}
      onChange={onFilterChange}
    >
      <FiltersHeader title="Filters" />
      <FiltersList>{params => <FiltersInput {...params} />}</FiltersList>
    </Filters>
  );
};
