import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CommonWorkflowEvent, CommonWorkflowStates, DefaultContextSchema } from '@ballerine/common';
import { checkCanMakeDecision } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-make-decision/check-can-make-decision';

export const checkCanRevision = ({
  caseState,
  noAction,
  workflow,
  decision,
  isLoadingRevision,
}: {
  caseState: ReturnType<typeof useCaseState>;
  noAction: boolean;
  workflow: TWorkflowById;
  decision: DefaultContextSchema['documents'][number]['decision'];
  isLoadingRevision: boolean;
}) => {
  const isStateManualReview = workflow.state === CommonWorkflowStates.MANUAL_REVIEW;

  const hasRevisionEvent = workflow?.nextEvents?.includes(CommonWorkflowEvent.REVISION);
  const canMakeDecision = checkCanMakeDecision({
    caseState,
    noAction,
    decision,
  });

  return !isLoadingRevision && canMakeDecision && (isStateManualReview || hasRevisionEvent);
};
