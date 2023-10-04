import { flexRender, getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table';
import { ElementRef, ForwardedRef, forwardRef } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell as TableCellUI,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../common/components/atoms/Table';
import { ITableCellProps } from './interfaces';

export const TableCell = forwardRef(
  <TData extends RowData, TValue = unknown>(
    { value }: ITableCellProps<TData, TValue>,
    ref: ForwardedRef<ElementRef<typeof Table>>,
  ) => {
    const table = useReactTable({
      ...value?.options,
      data: value.data ?? [],
      columns: value.columns ?? [],
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <Table ref={ref} {...value?.props?.table}>
        {value?.caption && <TableCaption {...value?.props?.caption}>{value.caption}</TableCaption>}
        <TableHeader {...value?.props?.header}>
          {table.getHeaderGroups()?.map(headerGroup => (
            <TableRow key={headerGroup.id} {...value?.props?.row}>
              {headerGroup.headers?.map(header => {
                return (
                  <TableHead key={header.id} {...value?.props?.head}>
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...value?.props?.body}>
          {!!table.getRowModel().rows?.length &&
            table.getRowModel().rows?.map(row => (
              <TableRow key={row.id} {...value?.props?.row}>
                {row.getVisibleCells()?.map(cell => (
                  <TableCellUI key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCellUI>
                ))}
              </TableRow>
            ))}
          {!table.getRowModel().rows?.length && (
            <TableRow {...value?.props?.row}>
              <TableCellUI
                colSpan={value?.columns?.length}
                className="h-24 text-center"
                {...value?.props?.cell}
              >
                No results.
              </TableCellUI>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  },
);
TableCell.displayName = 'TableCell';
