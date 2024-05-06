import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { useSort } from '@/common/hooks/useSort/useSort';
import { isInstanceOfFunction } from '@/common/utils/is-instance-of-function/is-instance-of-function';
import { TAlertsList } from '@/domains/alerts/fetchers';
import { checkIsBooleanishRecord } from '@/lib/zod/utils/checkers';
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { columns } from '../../columns';

export const useBusinessAlertsTableLogic = ({ data }: { data: TAlertsList }) => {
  const { onSort, sortBy, sortDir } = useSort();
  const { selected: ids, onSelect } = useSelect();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: sortBy || 'dataTimestamp',
      desc: sortDir === 'desc',
    },
  ]);
  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    sortingUpdaterOrValue => {
      setSorting(prevSortingState => {
        if (!isInstanceOfFunction(sortingUpdaterOrValue)) {
          onSort({
            sortBy: sortingUpdaterOrValue[0]?.id || 'dataTimestamp',
            sortDir: sortingUpdaterOrValue[0]?.desc ? 'desc' : 'asc',
          });

          return sortingUpdaterOrValue;
        }

        const newSortingState = sortingUpdaterOrValue(prevSortingState);

        onSort({
          sortBy: newSortingState[0]?.id || 'dataTimestamp',
          sortDir: newSortingState[0]?.desc ? 'desc' : 'asc',
        });

        return newSortingState;
      });
    },
    [onSort],
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    checkIsBooleanishRecord(ids) ? ids : {},
  );
  const onRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    selectionUpdaterOrValue => {
      setRowSelection(prevSelectionState => {
        if (!isInstanceOfFunction(selectionUpdaterOrValue)) {
          onSelect(selectionUpdaterOrValue);

          return selectionUpdaterOrValue;
        }

        const newSelectionState = selectionUpdaterOrValue(prevSelectionState);

        onSelect(newSelectionState);

        return newSelectionState;
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
  const locale = useLocale();
  const { pathname, search } = useLocation();
  const url = `${pathname}${search}`;
  const onRowClick = useCallback(() => {
    sessionStorage.setItem('transaction-monitoring:transactions-drawer:previous-path', url);
  }, [url]);

  useEffect(() => {
    if (Object.keys(ids ?? {}).length > 0) return;

    setRowSelection({});
  }, [ids]);

  return {
    table,
    locale,
    onRowClick,
    search,
  };
};
