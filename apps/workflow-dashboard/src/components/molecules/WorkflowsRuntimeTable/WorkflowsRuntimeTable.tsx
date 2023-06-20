import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/atoms/Table';
import { IWorkflowRuntime } from '@app/domains/workflows-runtime/api/workflows-runtime';
import { memo } from 'react';
import * as classnames from 'classnames';
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { defaultColumns } from '@app/components/molecules/WorkflowsRuntimeTable/columns';

interface Props {
  items: IWorkflowRuntime[];
  isFetching?: boolean;
}

export const WorkflowsRuntimeTable = memo(({ items, isFetching }: Props) => {
  const table = useReactTable({
    columns: defaultColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={classnames('bg-white', {
        ['opacity-40']: isFetching,
        ['pointer-events-none']: isFetching,
      })}
    >
      <Table className="relative h-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map(({ id: headerRowId, headers }) => {
            return (
              <TableRow key={headerRowId}>
                {headers.map(header => (
                  <TableHead key={header.id} className="w-1/4">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => {
                  console.log('val', cell.getValue());

                  return (
                    <TableCell
                      key={cell.id}
                      className="max-w-1/4 w-1/4"
                      title={String(cell.getValue())}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});
