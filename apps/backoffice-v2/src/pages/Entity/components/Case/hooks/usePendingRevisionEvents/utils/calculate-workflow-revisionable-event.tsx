import { TWorkflowById } from '@/domains/workflows/fetchers';
import { getPostDecisionEventName } from '@/lib/blocks/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';
import { CommonWorkflowEvent } from '@ballerine/common';

export const calculateWorkflowRevisionableEvent = (
  workflow: TWorkflowById,
  documentStatus: string,
) => {
  const postDecisionEvent = getPostDecisionEventName(workflow);
  if (postDecisionEvent) return postDecisionEvent;

  if (documentStatus === CommonWorkflowEvent.REVISION) {
    return CommonWorkflowEvent.REVISION;
  }

  console.error(
    `Missing Dispatchable Event WorkflowId: ${workflow.id} for documentStatus: ${documentStatus}`,
  );

  return documentStatus;
};
