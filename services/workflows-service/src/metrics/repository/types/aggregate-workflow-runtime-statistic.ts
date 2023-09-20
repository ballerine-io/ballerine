import { WorkflowRuntimeDataStatus } from '@prisma/client';

export interface IAggregateWorkflowRuntimeStatistic
  extends Record<WorkflowRuntimeDataStatus, number> {
  workflowDefinitionId: string;
  workflowDefinitionName: string;
}
