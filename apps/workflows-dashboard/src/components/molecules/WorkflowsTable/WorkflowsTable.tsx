import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table';
import { memo, useMemo } from 'react';
import classnames from 'classnames';
import { flexRender, getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { defaultColumns } from '@/components/molecules/WorkflowsTable/columns';
import Scrollbars from 'react-custom-scrollbars';
import {
  InputColumn,
  WorkflowsTableSorting,
  WorkflowTableColumnDef,
} from '@/components/molecules/WorkflowsTable/types';
import keyBy from 'lodash/keyBy';
import { mergeColumns } from '@/components/molecules/WorkflowsTable/utils/merge-columns';

interface Props {
  items: IWorkflow[];
  sorting?: WorkflowsTableSorting;
  isFetching?: boolean;
  columns?: InputColumn[];
  onSort: (key: string, direction: 'asc' | 'desc') => void;
}

export const WorkflowsTable = memo(({ items, isFetching, sorting, columns, onSort }: Props) => {
  // merging column parameters if provided
  const tableColumns = useMemo((): WorkflowTableColumnDef<IWorkflow>[] => {
    if (!Array.isArray(columns) || !columns.length) return defaultColumns;

    const columnsMap = keyBy(columns, 'id');

    return defaultColumns.map(defaultColumn => {
      const columnParams = columnsMap[defaultColumn.accessorKey];

      if (!columnParams) return defaultColumn;

      return mergeColumns(defaultColumn, columnParams);
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
        const sortingState = updater as SortingState;

        if (!sortingState[0]?.id) {
          console.error(`Invalid sorting state: ${JSON.stringify(sortingState)}`);

          return;
        }

        onSort(sortingState[0]?.id, sortingState[0]?.desc ? 'desc' : 'asc');
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
