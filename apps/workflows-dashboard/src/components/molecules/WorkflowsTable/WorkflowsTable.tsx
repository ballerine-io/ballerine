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
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { IWorkflow } from '@app/domains/workflows/api/workflow';
import { defaultColumns } from '@app/components/molecules/WorkflowsTable/columns';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  items: IWorkflow[];
  isFetching?: boolean;
}

export const WorkflowsTable = memo(({ items, isFetching }: Props) => {
  const table = useReactTable({
    columns: defaultColumns,
    data: items,
    enableColumnResizing: true,
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
        <Table className="table-fixed">
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
                          className="max-w-1/4 w-1/4 "
                          title={String(cell.getValue())}
                          style={{ maxWidth: `${cell.column.getSize()}px` }}
                        >
                          <p className="line-clamp-2 overflow-hidden text-ellipsis break-all">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </p>
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
