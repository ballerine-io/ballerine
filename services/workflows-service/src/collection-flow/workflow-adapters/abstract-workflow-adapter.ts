import { Customer, WorkflowRuntimeData } from '@prisma/client';

export abstract class IWorkflowAdapter<TFlowData = object> {
  abstract serialize(workflow: WorkflowRuntimeData): TFlowData;

  abstract deserialize(
    flowData: TFlowData,
    baseWorkflowRuntimeData: WorkflowRuntimeData,
    customer: Customer,
  ): WorkflowRuntimeData;
}
