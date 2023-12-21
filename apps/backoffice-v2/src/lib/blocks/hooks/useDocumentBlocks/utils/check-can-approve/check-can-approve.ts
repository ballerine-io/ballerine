import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CommonWorkflowEvent, DefaultContextSchema } from '@ballerine/common';
import { getPostDecisionEventName } from '@/lib/blocks/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';
import { checkCanMakeDecision } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-make-decision/check-can-make-decision';

export const checkCanApprove = ({
  caseState,
  noAction,
  workflow,
  decision,
  isLoadingApprove,
}: {
  caseState: ReturnType<typeof useCaseState>;
  noAction: boolean;
  workflow: TWorkflowById;
  decision: DefaultContextSchema['documents'][number]['decision'];
  isLoadingApprove: boolean;
}) => {
  const hasTaskReviewedEvent = !!getPostDecisionEventName(workflow);
  const hasApproveEvent = workflow?.nextEvents?.includes(CommonWorkflowEvent.APPROVE);
  const canMakeDecision = checkCanMakeDecision({
    caseState,
    noAction,
    decision,
  });

  return !isLoadingApprove && canMakeDecision && (hasTaskReviewedEvent || hasApproveEvent);
};
