import { IWorkflowRuntime } from '@app/domains/workflows-runtime/api/workflows-runtime';
import { ColumnDef } from '@tanstack/react-table';

export const defaultColumns: ColumnDef<IWorkflowRuntime>[] = [
  {
    accessorKey: 'id',
    cell: info => info.getValue<string>(),
    header: () => 'Id',
  },
  {
    accessorKey: 'status',
    cell: info => info.getValue<string>(),
    header: () => 'Status',
  },
  {
    accessorKey: 'updatedAt',
    header: () => 'Last Update',
  },
  {
    accessorKey: 'context',
    accessorFn: row => JSON.stringify(row.context),
    cell: info => <p className={'line-clamp-2'}>{info.getValue<string>()}</p>,
    header: () => 'Context',
  },
];
