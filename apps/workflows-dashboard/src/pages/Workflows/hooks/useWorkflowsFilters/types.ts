import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';

export interface WorkflowsFilterValues {
  status?: IWorkflowStatus;
  page?: number;
  limit?: number;
}
