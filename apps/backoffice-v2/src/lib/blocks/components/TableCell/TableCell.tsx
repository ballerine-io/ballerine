import { flexRender, getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table';
import React, { ElementRef, ForwardedRef, forwardRef } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell as TableCellComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../common/components/atoms/Table';
import { ITableCellProps } from './interfaces';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { DefaultCell } from './DefaultCell';

export const TableCell = forwardRef(
  <TData extends RowData, TValue = unknown>(
    { value }: ITableCellProps<TData, TValue>,
    ref: ForwardedRef<ElementRef<typeof Table>>,
  ) => {
    const table = useReactTable<TData>({
      ...value?.options,
      data: value.data ?? [],
      columns: value.columns ?? [],
      getCoreRowModel: getCoreRowModel(),
      defaultColumn: {
        cell: DefaultCell,
      },
    });

    return (
      <Table ref={ref} {...value?.props?.table}>
        {value?.caption && (
          <TableCaption
            {...value?.props?.caption}
            className={ctw(value?.props?.caption?.className, 'text-foreground')}
          >
            {value.caption}
          </TableCaption>
        )}
        <TableHeader {...value?.props?.header}>
          {table.getHeaderGroups()?.map(headerGroup => (
            <TableRow
              key={headerGroup.id}
              {...value?.props?.row}
              className={ctw(value?.props?.row?.className, 'hover:bg-unset border-none')}
            >
              {headerGroup.headers?.map((header, index) => {
                return (
                  <TableHead
                    key={header.id}
                    {...value?.props?.head}
                    className={ctw(
                      value?.props?.head?.className,
                      '!h-[unset] !pl-3 pb-2 pt-0 text-sm font-medium leading-none text-foreground',
                      {
                        '!pl-3.5': index === 0,
                      },
                    )}
                  >
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
              <TableRow
                key={row.id}
                {...value?.props?.row}
                className={ctw(value?.props?.row?.className, 'hover:bg-unset h-6 border-none')}
              >
                {row.getVisibleCells()?.map(cell => (
                  <TableCellComponent
                    key={cell.id}
                    {...value?.props?.cell}
                    className={ctw(value?.props?.cell?.className, '!py-px !pl-3.5')}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCellComponent>
                ))}
              </TableRow>
            ))}
          {!table.getRowModel().rows?.length && (
            <TableRow
              {...value?.props?.row}
              className={ctw(value?.props?.row?.className, 'hover:bg-unset h-6 border-none')}
            >
              <TableCellComponent
                colSpan={value?.columns?.length}
                {...value?.props?.cell}
                className={ctw(value?.props?.cell?.className, '!py-px !pl-3.5')}
              >
                No results.
              </TableCellComponent>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  },
);
TableCell.displayName = 'TableCell';
