import { IWorkflowRuntimeStatus } from '@app/domains/workflows-runtime/api/workflows-runtime';

export interface WorkflowsRuntimeFilterValues {
  status?: IWorkflowRuntimeStatus;
  page?: number;
  limit?: number;
}
