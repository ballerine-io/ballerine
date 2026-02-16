import { IWorkflowAdapter } from '@/collection-flow/workflow-adapters/abstract-workflow-adapter';
import { Customer, WorkflowRuntimeData } from '@prisma/client';

/**
 * Passthrough adapter for the Sierra Leone KYC onboarding workflow.
 *
 * The kyc-mobile page only needs the raw workflow runtime data (state, context,
 * endUserId, documents) — it does not use any adapter-specific transformations.
 * This adapter simply passes the data through unchanged.
 */
export class KycOnboardingSierraLeoneAdapter extends IWorkflowAdapter<WorkflowRuntimeData> {
  serialize(workflow: WorkflowRuntimeData): WorkflowRuntimeData {
    return workflow;
  }

  deserialize(
    flowData: WorkflowRuntimeData,
    baseWorkflowRuntimeData: WorkflowRuntimeData,
    _customer: Customer,
  ): WorkflowRuntimeData {
    // Merge any incoming context updates from the collection flow
    return {
      ...baseWorkflowRuntimeData,
      context: {
        ...baseWorkflowRuntimeData.context,
        ...(flowData.context || {}),
      },
    } as WorkflowRuntimeData;
  }
}
