import { HealthIndicator } from '@app/components/atoms/HealthIndicator';
import { formatDate } from '@app/components/molecules/WorkflowsTable/utils/format-date';
import { IWorkflow, IWorkflowAssignee } from '@app/domains/workflows/api/workflow';
import { getWorkflowHealthStatus } from '@app/utils/get-workflow-health-status';
import { ColumnDef } from '@tanstack/react-table';

export const defaultColumns: ColumnDef<IWorkflow>[] = [
  {
    accessorKey: 'id',
    cell: info => info.getValue<string>(),
    header: () => 'ID',
    size: 280,
  },
  {
    accessorKey: 'workflowDefinitionName',
    cell: info => info.getValue<string>(),
    header: 'Workflow Definition Name',
    size: 200,
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
    accessorKey: 'assignee',
    cell: info => {
      const assignee = info.getValue<IWorkflowAssignee>();
      if (!assignee) return '-';

      return `${assignee.firstName} ${assignee.lastName}`;
    },
    header: 'Assign To',
    size: 125,
  },
  {
    accessorKey: 'context',
    accessorFn: row => JSON.stringify(row.context),
    cell: info => info.getValue<string>(),
    header: () => 'Context',
    size: 300,
  },
  {
    accessorKey: 'resolvedAt',
    cell: info => (info.getValue<Date>() ? formatDate(info.getValue<Date>()) : '-'),
    header: 'Resolved At',
  },
  {
    accessorKey: 'createdBy',
    cell: info => info.getValue<string>(),
    header: 'Created By',
  },
  {
    accessorKey: 'createdAt',
    cell: info => formatDate(info.getValue<Date>()),
    header: 'Created At',
    size: 240,
  },
];
