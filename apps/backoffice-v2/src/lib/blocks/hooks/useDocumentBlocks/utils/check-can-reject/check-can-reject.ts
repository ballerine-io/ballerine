import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CommonWorkflowEvent, CommonWorkflowStates, DefaultContextSchema } from '@ballerine/common';
import { checkCanMakeDecision } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-make-decision/check-can-make-decision';

export const checkCanReject = ({
  caseState,
  noAction,
  workflow,
  decision,
  isLoadingReject,
}: {
  caseState: ReturnType<typeof useCaseState>;
  noAction: boolean;
  workflow: TWorkflowById;
  decision: DefaultContextSchema['documents'][number]['decision'];
  isLoadingReject: boolean;
}) => {
  const isStateManualReview = workflow.state === CommonWorkflowStates.MANUAL_REVIEW;

  const hasRejectEvent = workflow?.nextEvents?.includes(CommonWorkflowEvent.REJECT);
  const canMakeDecision = checkCanMakeDecision({
    caseState,
    noAction,
    decision,
  });

  return !isLoadingReject && canMakeDecision && (isStateManualReview || hasRejectEvent);
};
