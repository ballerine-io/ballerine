import { IWorkflow } from '@/domains/workflows/api/workflow';
import { AccessorFnColumnDef, ColumnDef } from '@tanstack/react-table';

export interface WorkflowsTableSorting {
  key: string;
  direction: 'asc' | 'desc';
}

export type WorkflowTableColumnKeys =
  | 'id'
  | 'workflowDefinitionName'
  | 'status'
  | 'state'
  | 'assignee'
  | 'context'
  | 'view-workflow'
  | 'resolvedAt'
  | 'createdBy'
  | 'createdAt'
  | 'workflowDefinitionId';

export type WorkflowTableColumnDef<TData> = Omit<ColumnDef<TData>, 'accessorKey'> & {
  accessorFn?: AccessorFnColumnDef<TData>['accessorFn'];
  accessorKey: WorkflowTableColumnKeys;
};

export type InputColumn<TData = IWorkflow> = Partial<WorkflowTableColumnDef<TData>> & {
  id: WorkflowTableColumnKeys;
};
