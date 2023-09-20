import { AccessorFnColumnDef, ColumnDef } from '@tanstack/react-table';

export interface WorkflowTableItem {
  id: string;
  workflowDefinitionName: string;
  workflowDefinitionId: string;
  status: string;
  state: string | null;
  assignee: {
    firstName: string;
    lastName: string;
  } | null;
  context: object;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
}

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
  | 'createdAt';

export type WorkflowTableColumnDef<TData> = Omit<ColumnDef<TData>, 'accessorKey'> & {
  accessorFn?: AccessorFnColumnDef<TData>['accessorFn'];
  accessorKey: WorkflowTableColumnKeys;
};

export type InputColumn<TData = WorkflowTableItem> = Partial<WorkflowTableColumnDef<TData>> & {
  id: WorkflowTableColumnKeys;
};
