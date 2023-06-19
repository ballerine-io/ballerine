import { WorkflowRuntimeDataStatus } from '@prisma/client';

export interface ListWorkflowsRuntimeParams {
  page?: number;
  size?: number;
  status?: WorkflowRuntimeDataStatus;
}
