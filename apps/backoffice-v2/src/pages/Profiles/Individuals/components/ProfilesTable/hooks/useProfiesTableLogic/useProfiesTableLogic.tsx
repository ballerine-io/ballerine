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
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useLocation } from 'react-router-dom';
import { TIndividualsProfiles } from '@/domains/profiles/fetchers';

export const useProfilesTableLogic = ({ data }: { data: TIndividualsProfiles }) => {
  const { onSort, sortBy, sortDir } = useSort();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: sortBy || 'createdAt',
      desc: sortDir === 'desc',
    },
  ]);
  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    sortingUpdaterOrValue => {
      setSorting(prevSortingState => {
        if (!isInstanceOfFunction(sortingUpdaterOrValue)) {
          onSort({
            sortBy: sortingUpdaterOrValue[0]?.id || 'createdAt',
            sortDir: sortingUpdaterOrValue[0]?.desc ? 'desc' : 'asc',
          });

          return sortingUpdaterOrValue;
        }

        const newSortingState = sortingUpdaterOrValue(prevSortingState);

        onSort({
          sortBy: newSortingState[0]?.id || 'createdAt',
          sortDir: newSortingState[0]?.desc ? 'desc' : 'asc',
        });

        return newSortingState;
      });
    },
    [onSort],
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
    enableRowSelection: true,
    getRowId: row => row.id,
  });
  const locale = useLocale();
  const { search } = useLocation();

  return {
    table,
    locale,
    search,
  };
};
