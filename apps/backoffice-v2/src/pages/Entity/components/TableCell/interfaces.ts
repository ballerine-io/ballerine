import { ComponentProps } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../common/components/atoms/Table';
import { ColumnDef, RowData, TableOptions } from '@tanstack/react-table';

export interface ITableCellProps<TData extends RowData, TValue = unknown> {
  // Props to be used explicitly by the cell inside 'value'. Props outside 'value' to be used by the blocks API.
  value: {
    caption?: ComponentProps<typeof TableCaption>['children'];
    columns: Array<ColumnDef<TData, TValue>>;
    data: Array<TData>;

    // Component props
    props?: {
      table?: ComponentProps<typeof Table>;
      header?: ComponentProps<typeof TableHeader>;
      head?: ComponentProps<typeof TableHead>;
      row?: ComponentProps<typeof TableRow>;
      body?: ComponentProps<typeof TableBody>;
      cell?: ComponentProps<typeof TableCell>;
      caption?: ComponentProps<typeof TableCaption>;
    };
    // react-table options
    options?: Omit<TableOptions<TData>, 'getCoreRowModel' | 'data' | 'columns'>;
  };
}
