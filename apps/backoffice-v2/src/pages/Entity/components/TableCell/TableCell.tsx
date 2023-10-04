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
import { isValidUrl } from '../../../../common/utils/is-valid-url';
import { buttonVariants } from '../../../../common/components/atoms/Button/Button';
import { isObject } from '@ballerine/common';
import { FileJson2 } from 'lucide-react';
import { JsonDialog } from '../../../../common/components/molecules/JsonDialog';
import { isValidDate } from '../../../../common/utils/is-valid-date';
import { isValidIsoDate } from '../../../../common/utils/is-valid-iso-date/is-valid-iso-date';
import { formatDate } from '../../../../common/utils/format-date';
import dayjs from 'dayjs';

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
      defaultColumn: {
        cell: props => {
          const value = props.getValue();

          if (isValidDate(value, { isStrict: false }) || isValidIsoDate(value)) {
            return formatDate(dayjs(value).toDate());
          }

          if (isObject(value) || Array.isArray(value)) {
            return (
              <div className={`flex items-end justify-start`}>
                <JsonDialog
                  buttonProps={{
                    variant: 'link',
                    className: 'p-0 text-blue-500',
                  }}
                  rightIcon={<FileJson2 size={`16`} />}
                  dialogButtonText={`View Information`}
                  json={JSON.stringify(value)}
                />
              </div>
            );
          }

          if (isValidUrl(value)) {
            return (
              <a
                className={buttonVariants({
                  variant: 'link',
                  className: '!block cursor-pointer !p-0 !text-blue-500',
                })}
                target={'_blank'}
                rel={'noopener noreferrer'}
                href={value}
              >
                {value}
              </a>
            );
          }

          return value;
        },
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
              className={ctw(value?.props?.row?.className, 'border-none')}
            >
              {headerGroup.headers?.map(header => {
                return (
                  <TableHead
                    key={header.id}
                    {...value?.props?.head}
                    className={ctw(value?.props?.head?.className, 'font-bold text-foreground')}
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
                    className={ctw(value?.props?.cell?.className, 'py-1')}
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
                className={ctw(value?.props?.cell?.className, 'h-24 text-center')}
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
