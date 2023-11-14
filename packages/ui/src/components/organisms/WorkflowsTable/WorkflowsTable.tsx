import { Table } from '@/components/atoms/Table/Table';
import { TableBody } from '@/components/atoms/Table/TableBody';
import { TableCell } from '@/components/atoms/Table/TableCell';
import { TableHead } from '@/components/atoms/Table/TableHead';
import { TableHeader } from '@/components/atoms/Table/TableHeader';
import { TableRow } from '@/components/atoms/Table/TableRow';
import { useMemo } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { defaultColumns } from './columns';
import {
  InputColumn,
  WorkflowsTableSorting,
  WorkflowTableColumnDef,
  WorkflowTableItem,
} from './types';
import keyBy from 'lodash/keyBy';
import { mergeColumns } from './utils/merge-columns';
import { TableContainer } from './components/TableContainer';
import { ScrollContainer } from './components/ScrollContainer';

interface Props {
  items: WorkflowTableItem[];
  sorting?: WorkflowsTableSorting;
  isFetching?: boolean;
  columns?: InputColumn[];
  onSort: (key: string, direction: 'asc' | 'desc') => void;
}

export function WorkflowsTable({ items, isFetching, sorting, columns, onSort }: Props) {
  // merging column parameters if provided
  const tableColumns = useMemo((): WorkflowTableColumnDef<WorkflowTableItem>[] => {
    if (!Array.isArray(columns) || !columns.length) return defaultColumns;

    const columnsMap = keyBy(columns, 'id');

    return defaultColumns.map(defaultColumn => {
      const columnParams = columnsMap[defaultColumn.accessorKey];

      if (!columnParams) return defaultColumn;

      return mergeColumns<WorkflowTableItem>(defaultColumn, columnParams);
    });
  }, [columns]);

  const table = useReactTable({
    columns: tableColumns,
    data: items,
    enableColumnResizing: true,
    manualSorting: false,
    state: {
      sorting: sorting
        ? [
            {
              id: sorting.key,
              desc: sorting.direction === 'desc',
            },
          ]
        : [],
    },
    onSortingChange: updater => {
      if (typeof updater === 'function') {
        const newSortingValue = updater(table.getState().sorting);
        table.setSorting(newSortingValue);
      } else {
        const sortingState = updater;
        onSort(sortingState[0].id, sortingState[0].desc ? 'desc' : 'asc');
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = !items.length && !isFetching;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(({ id: headerRowId, headers }) => {
          return (
            <TableRow key={headerRowId}>
              {headers.map(header => (
                <TableHead key={header.id} className="font-inter sticky top-0 w-1/4 bg-white">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          );
        })}
      </TableHeader>
      <TableBody>
        {isEmpty ? (
          <TableRow>
            <TableCell colSpan={table.getAllColumns().length} className="font-inter text-center">
              Workflows not found.
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map(row => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <TableCell
                      key={cell.id}
                      className="max-w-1/4 w-1/4 whitespace-nowrap"
                      title={String(cell.getValue())}
                      style={{
                        minWidth: `${cell.column.getSize()}px`,
                      }}
                    >
                      <div className="line-clamp-1 overflow-hidden text-ellipsis break-all">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

WorkflowsTable.Container = TableContainer;
WorkflowsTable.ScrollContainer = ScrollContainer;
