import { WorkflowDefinition, WorkflowRuntimeData } from '@prisma/client';

export const makeFullWorkflow = (
  data: Array<WorkflowRuntimeData & { workflowDefinition: WorkflowDefinition }>,
) =>
  data?.map(({ workflowDefinition, ...workflowRuntimeData }) => ({
    workflowRuntimeData,
    workflowDefinition,
  }));
