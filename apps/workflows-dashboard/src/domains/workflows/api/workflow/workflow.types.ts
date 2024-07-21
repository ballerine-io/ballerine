export type IWorkflowStatus = 'active' | 'completed' | 'failed';

export interface IWorkflowAssignee {
  firstName: string;
  lastName: string;
}
export interface IWorkflow {
  id: string;
  workflowDefinitionName: string;
  workflowDefinitionId: string;
  status: IWorkflowStatus;
  state: string | null;
  assignee: IWorkflowAssignee | null;
  context: object;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
}

export interface GetWorkflowResponse {
  results: IWorkflow[];
  meta: {
    pages: number;
    total: number;
  };
}

export interface GetWorkflowsDto {
  status?: IWorkflowStatus[];
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export type IWorkflowDefinition = object;
