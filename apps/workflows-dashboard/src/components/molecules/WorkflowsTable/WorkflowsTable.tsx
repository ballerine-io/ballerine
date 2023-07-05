import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/atoms/Table';
import { memo } from 'react';
import * as classnames from 'classnames';
import { useReactTable, flexRender, getCoreRowModel, SortingState } from '@tanstack/react-table';
import { IWorkflow } from '@app/domains/workflows/api/workflow';
import { defaultColumns } from '@app/components/molecules/WorkflowsTable/columns';
import Scrollbars from 'react-custom-scrollbars';

export interface WorkflowsTableSorting {
  key: string;
  direction: 'asc' | 'desc';
}

interface Props {
  items: IWorkflow[];
  sorting?: WorkflowsTableSorting;
  isFetching?: boolean;
  onSort: (key: string, direction: 'asc' | 'desc') => void;
}

export const WorkflowsTable = memo(({ items, isFetching, sorting, onSort }: Props) => {
  const table = useReactTable({
    columns: defaultColumns,
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
        const sortingState = updater as SortingState;
        onSort(sortingState[0].id, sortingState[0].desc ? 'desc' : 'asc');
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = !items.length && !isFetching;

  return (
    <div
      className={classnames('relative w-full overflow-auto bg-white', 'rounded-md  border', {
        ['opacity-40']: isFetching,
        ['pointer-events-none']: isFetching,
      })}
    >
      <Scrollbars autoHide>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(({ id: headerRowId, headers }) => {
              return (
                <TableRow key={headerRowId}>
                  {headers.map(header => (
                    <TableHead key={header.id} className="sticky top-0 w-1/4 bg-white">
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
                <TableCell colSpan={table.getAllColumns().length} className="text-center">
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
      </Scrollbars>
    </div>
  );
});
