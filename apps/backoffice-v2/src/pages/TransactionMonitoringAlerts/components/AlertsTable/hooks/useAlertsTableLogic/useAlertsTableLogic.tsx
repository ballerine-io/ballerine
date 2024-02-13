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
      setSorting(old => {
        if (!isInstanceOfFunction(updaterOrValue)) {
          onSort({
            sortBy: updaterOrValue[0]?.id || 'dataTimestamp',
            sortDir: updaterOrValue[0]?.desc ? 'desc' : 'asc',
          });

          return updaterOrValue;
        }

        const nextValue = updaterOrValue(old);

        onSort({
          sortBy: nextValue[0]?.id || 'dataTimestamp',
          sortDir: nextValue[0]?.desc ? 'desc' : 'asc',
        });

        return nextValue;
      });
    },
    [onSort],
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    checkIsBooleanishRecord(ids) ? ids : {},
  );
  const onRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    updaterOrValue => {
      setRowSelection(old => {
        if (!isInstanceOfFunction(updaterOrValue)) {
          onSelect(updaterOrValue);

          return updaterOrValue;
        }

        const nextValue = updaterOrValue(old);

        onSelect(nextValue);

        return nextValue;
      });
    },
    [onSelect],
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
    onRowSelectionChange,
    getRowId: row => row.id,
  });

  useEffect(() => {
    if (Object.keys(ids ?? {}).length > 0) return;

    setRowSelection({});
  }, [ids]);

  return {
    table,
  };
};
