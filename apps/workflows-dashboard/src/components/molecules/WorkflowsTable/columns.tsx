import { HealthIndicator } from '@/components/atoms/HealthIndicator';
import { CloneWorkflowDefinitionButton } from '@/components/molecules/CloneWorkflowDefinitionButton';
import { JSONViewButton } from '@/components/molecules/JSONViewButton';
import { DataTableColumnHeader } from '@/components/molecules/WorkflowsTable/components/DataTableColumnHeader';
import { StateUpdaterColumn } from '@/components/molecules/WorkflowsTable/components/StateUpdaterColumn';
import { WorkflowTableColumnDef } from '@/components/molecules/WorkflowsTable/types';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { formatDate } from '@/utils/format-date';
import { getWorkflowHealthStatus } from '@/utils/get-workflow-health-status';
import { Eye, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { WorkflowLogsModal } from '@/components/molecules/WorkflowLogsModal';

// Component for the workflow logs button
const WorkflowLogsButton = ({ workflowId }: { workflowId: string }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setShowModal(true)}
      >
        <ClipboardList className="h-4 w-4" />
        <span>Logs</span>
      </Button>

      <WorkflowLogsModal
        workflowId={workflowId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export const defaultColumns: Array<WorkflowTableColumnDef<IWorkflow>> = [
  {
    accessorKey: 'id',
    cell: info => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-gray-600">{info.getValue<string>()}</span>
        <button
          onClick={() => {
            navigator.clipboard
              .writeText(info.getValue<string>())
              .then(() => {
                toast.success('ID copied to clipboard');
              })
              .catch(() => {
                toast.error('Failed to copy ID to clipboard');
              });
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    ),
    header: () => <span className="font-semibold">ID</span>,
  },
  {
    accessorKey: 'workflowDefinitionName',
    cell: info => <span className="font-medium text-blue-600">{info.getValue<string>()}</span>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workflow Definition Name" />
    ),
  },
  {
    accessorKey: 'workflowDefinitionId',
    cell: info => <CloneWorkflowDefinitionButton workflowDefinitionId={info.getValue<string>()} />,
    header: () => '',
  },
  {
    accessorKey: 'status',
    cell: info => (
      <div className="flex items-center gap-4">
        <HealthIndicator healthStatus={getWorkflowHealthStatus(info.row.original)} />
        <span className="font-medium capitalize">{info.getValue<string>() || ''}</span>
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
    cell: info => <span className="text-gray-700">{info.getValue<string>()}</span>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assign To" />,
  },
  {
    accessorKey: 'context',
    accessorFn: row => JSON.stringify(row.context),
    cell: info => (
      <div className="flex flex-row items-center gap-3">
        <JSONViewButton
          trigger={
            <Eye className="h-5 w-5 cursor-pointer text-gray-600 transition-colors hover:text-blue-600" />
          }
          json={info.getValue<string>()}
        />
      </div>
    ),
    header: () => <span className="font-semibold">Context</span>,
  },
  {
    accessorKey: 'view-workflow',
    accessorFn: row => row.id,
    cell: () => '-',
    header: () => <span className="font-semibold">Workflow</span>,
  },
  {
    accessorKey: 'workflow-logs',
    accessorFn: row => row.id,
    cell: info => <WorkflowLogsButton workflowId={info.getValue<string>()} />,
    header: () => <span className="font-semibold">Logs</span>,
  },
  {
    accessorKey: 'resolvedAt',
    cell: info => (
      <span className="text-gray-700">
        {info.getValue<Date>() ? formatDate(info.getValue<Date>()) : '-'}
      </span>
    ),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Resolved At" />,
  },
  {
    accessorKey: 'createdBy',
    cell: info => <span className="text-gray-700">{info.getValue<string>()}</span>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created By" />,
  },
  {
    accessorKey: 'createdAt',
    cell: info => <span className="text-gray-700">{formatDate(info.getValue<Date>())}</span>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
  },
];
