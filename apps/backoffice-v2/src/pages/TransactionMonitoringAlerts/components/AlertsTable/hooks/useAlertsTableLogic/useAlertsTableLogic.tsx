import { TAlertsList } from '@/domains/alerts/fetchers';
import { useSort } from '@/common/hooks/useSort/useSort';
import { useCallback, useState } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { isInstanceOfFunction } from '@/common/utils/is-instance-of-function/is-instance-of-function';
import { columns } from '../../columns';

export const useAlertsTableLogic = ({ data }: { data: TAlertsList }) => {
  const { onSortDirToggle, onSortBy, sortBy, sortDir } = useSort();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: sortBy || 'dataTimestamp',
      desc: sortDir === 'desc',
    },
  ]);
  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    updaterOrValue => {
      setSorting(updaterOrValue);

      if (!isInstanceOfFunction(updaterOrValue)) return;

      const [currentSorting] = updaterOrValue();

      if (!currentSorting) return;

      onSortBy(currentSorting?.id);
      onSortDirToggle(currentSorting?.desc ? 'asc' : 'desc');
    },
    [onSortBy, onSortDirToggle],
  );
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    manualSorting: true,
    sortDescFirst: true,
    state: {
      sorting,
    },
    onSortingChange,
  });

  return {
    table,
  };
};
