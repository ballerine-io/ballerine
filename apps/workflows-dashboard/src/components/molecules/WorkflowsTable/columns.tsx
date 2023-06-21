import { HealthIndicator } from '@app/components/atoms/HealthIndicator';
import { IWorkflow } from '@app/domains/workflows/api/workflow';
import { getWorkflowHealthStatus } from '@app/utils/get-workflow-health-status';
import { ColumnDef } from '@tanstack/react-table';

export const defaultColumns: ColumnDef<IWorkflow>[] = [
  {
    accessorKey: 'id',
    cell: info => info.getValue<string>(),
    header: () => 'ID',
    size: 240,
  },
  {
    accessorKey: 'workflowDefinitionId',
    cell: info => info.getValue<string>(),
    header: 'Workflow Definition ID',
    size: 5000,
  },
  {
    accessorKey: 'status',
    cell: info => (
      <div className="font-inter flex flex-row flex-nowrap gap-4 font-medium capitalize">
        <HealthIndicator healthStatus={getWorkflowHealthStatus(info.row.original)} />
        {info.getValue<string>() || ''}
      </div>
    ),
    header: () => 'Status',
    size: 125,
  },
  {
    accessorKey: 'state',
    cell: info => info.getValue<string>(),
    header: 'State',
    size: 125,
  },
  {
    accessorKey: 'assigneeId',
    cell: info => info.getValue<string>(),
    header: 'Assign To',
    size: 125,
  },
  {
    accessorKey: 'context',
    accessorFn: row => JSON.stringify(row.context),
    cell: info => info.getValue<string>(),
    header: () => 'Context',
    size: 200,
  },
  {
    accessorKey: 'resolvedAt',
    cell: info => info.getValue<string>() || '-',
    header: 'Resolved At',
  },
  {
    accessorKey: 'createdBy',
    cell: info => info.getValue<string>(),
    header: 'Created By',
  },
  {
    accessorKey: 'createdAt',
    cell: info => info.getValue<string>(),
    header: 'Created At',
  },
];
