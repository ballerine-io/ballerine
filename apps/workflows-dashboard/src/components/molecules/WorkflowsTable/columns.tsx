import { HealthIndicator } from '@/components/atoms/HealthIndicator';
import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { DataTableColumnHeader } from '@/components/molecules/WorkflowsTable/components/DataTableColumnHeader';
import { StateUpdaterColumn } from '@/components/molecules/WorkflowsTable/components/StateUpdaterColumn';
import { WorkflowTableColumnDef } from '@/components/molecules/WorkflowsTable/types';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { formatDate } from '@/utils/format-date';
import { getWorkflowHealthStatus } from '@/utils/get-workflow-health-status';

export const defaultColumns: WorkflowTableColumnDef<IWorkflow>[] = [
  {
    accessorKey: 'id',
    cell: info => info.getValue<string>(),
    header: () => 'ID',
  },
  {
    accessorKey: 'workflowDefinitionName',
    cell: info => info.getValue<string>(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workflow Definition Name" />
    ),
  },
  {
    accessorKey: 'status',
    cell: info => (
      <div className="font-inter flex flex-row flex-nowrap gap-4 font-medium capitalize">
        <HealthIndicator healthStatus={getWorkflowHealthStatus(info.row.original)} />
        {info.getValue<string>() || ''}
      </div>
    ),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  },
  {
    accessorKey: 'state',
    cell: info => (
      <StateUpdaterColumn
        state={info.getValue<string>()}
        workflow={info.row.original}
        workflowDefinition={info.row.original.workflowDefinition}
      />
    ),
    header: ({ column }) => <DataTableColumnHeader column={column} title="State" />,
  },
  {
    accessorKey: 'assignee',
    accessorFn: row => (row.assignee ? `${row.assignee.firstName} ${row.assignee.lastName}` : '-'),
    cell: info => info.getValue<string>(),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assign To" />,
  },
  {
    accessorKey: 'context',
    accessorFn: row => JSON.stringify(row.context),
    cell: info => <JSONViewButton json={info.getValue<string>()} />,
    header: () => 'Context',
  },
  {
    accessorKey: 'view-workflow',
    accessorFn: row => row.id,
    cell: () => '-',
    header: () => 'Workflow',
  },
  {
    accessorKey: 'resolvedAt',
    cell: info => (info.getValue<Date>() ? formatDate(info.getValue<Date>()) : '-'),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Resolved At" />,
  },
  {
    accessorKey: 'createdBy',
    cell: info => info.getValue<string>(),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created By" />,
  },
  {
    accessorKey: 'createdAt',
    cell: info => formatDate(info.getValue<Date>()),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
  },
];
