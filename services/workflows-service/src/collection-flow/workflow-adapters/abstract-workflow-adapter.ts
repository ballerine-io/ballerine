import { WorkflowRuntimeData } from '@prisma/client';

export abstract class IWorkflowAdapter<TFlowData = {}> {
  abstract serialize(workflow: WorkflowRuntimeData): TFlowData;

  abstract deserialize(
    flowData: TFlowData,
    baseWorkflowRuntimeData: WorkflowRuntimeData,
  ): WorkflowRuntimeData;
}
