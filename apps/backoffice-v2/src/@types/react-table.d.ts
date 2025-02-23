import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  import { RowData } from '@tanstack/react-table';

  interface ColumnMeta<TData extends RowData, TValue> {
    useWrapper?: boolean;
  }
}

export {};
