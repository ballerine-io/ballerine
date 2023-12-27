import { TWorkflowById } from '@/domains/workflows/fetchers';
import { getPostDecisionEventName } from '@/lib/blocks/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';
import { CommonWorkflowEvent } from '@ballerine/common';

export const calculateWorkflowRevisionableEvent = (
  workflow: TWorkflowById,
  documentStatus: string,
) => {
  const postDecisionEvent = getPostDecisionEventName(workflow);
  const dispatchableEvent =
    postDecisionEvent || documentStatus === CommonWorkflowEvent.REVISION
      ? (CommonWorkflowEvent.REVISION as string)
      : undefined;

  console.error(
    `Missing Dispatchable Event WorkflowId: ${workflow.id} for documentStatus: ${documentStatus}`,
  );

  return dispatchableEvent;
};
