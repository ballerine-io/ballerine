import { IWorkflowStatus } from '@app/domains/workflows/api/workflow/workflow.types';

export type IWorkflowStatusMetric = Record<IWorkflowStatus, number>;

export interface IWorkflowApprovedMetric {
  workflowId: string;
  approvedDate: Date;
}

export interface GetWorkflowMetricsResponse {
  status: IWorkflowStatusMetric;
  approvedWorkflows: IWorkflowApprovedMetric[];
}

export type WorkflowStatsPerStatus = Record<IWorkflowStatus, number>;
export interface IWorkflowDefinitionStats {
  id: string;
  name: string;
  stats: WorkflowStatsPerStatus;
}
