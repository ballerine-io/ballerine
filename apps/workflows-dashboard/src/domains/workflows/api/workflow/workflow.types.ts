export type IWorkflowStatus = 'active' | 'completed' | 'failed';

export interface IWorkflow {
  id: string;
  endUserId: string | null;
  businessId: string | null;
  assigneeId: string | null;
  workflowDefinitionId: string;
  context: object;
  state: string | null;
  status: IWorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetWorkflowResponse {
  results: IWorkflow[];
  totalPages: null | number;
  totalItems: number;
}

export interface GetWorkflowsDto {
  status?: IWorkflowStatus;
  page?: number;
  limit?: number;
}
