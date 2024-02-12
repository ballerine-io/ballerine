import { TAlertsList } from '@/domains/alerts/fetchers';
import { useSort } from '@/common/hooks/useSort/useSort';
import { useCallback, useEffect, useState } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { isInstanceOfFunction } from '@/common/utils/is-instance-of-function/is-instance-of-function';
import { columns } from '../../columns';
import { checkIsBooleanishRecord } from '@/lib/zod/utils/checkers';
import { useSelect } from '@/common/hooks/useSelect/useSelect';

export const useAlertsTableLogic = ({ data }: { data: TAlertsList }) => {
  const { onSort, sortBy, sortDir } = useSort();
  const { selected: ids, onSelect } = useSelect();
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

      onSort({
        sortBy: currentSorting.id,
        sortDir: currentSorting.desc ? 'desc' : 'asc',
      });
    },
    [onSort],
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    checkIsBooleanishRecord(ids) ? ids : {},
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
      rowSelection,
    },
    onSortingChange,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: row => row.id,
  });

  useEffect(() => {
    onSelect(rowSelection);
  }, [onSelect, rowSelection]);

  return {
    table,
  };
};
