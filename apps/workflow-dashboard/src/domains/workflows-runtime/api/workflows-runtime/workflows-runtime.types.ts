export type IWorkflowRuntimeStatus = 'active' | 'completed' | 'failed';

export interface IWorkflowRuntime {
  id: string;
  endUserId: string | null;
  businessId: string | null;
  assigneeId: string | null;
  workflowDefinitionId: string;
  context: object;
  state: string | null;
  status: IWorkflowRuntimeStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetWorkflowRuntimeResponse {
  results: IWorkflowRuntime[];
  totalPages: null | number;
  totalItems: number;
}

export interface GetWorkflowsRuntimeDto {
  status?: IWorkflowRuntimeStatus;
  page?: number;
  limit?: number;
}
