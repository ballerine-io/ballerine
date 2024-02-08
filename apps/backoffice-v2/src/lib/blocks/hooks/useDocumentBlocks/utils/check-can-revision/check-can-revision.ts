import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CommonWorkflowEvent, DefaultContextSchema } from '@ballerine/common';
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
  const hasTaskReviewedEvent = Boolean(
    workflow?.nextEvents?.includes(CommonWorkflowEvent.TASK_REVIEWED),
  );
  const hasRevisionEvent = workflow?.nextEvents?.includes(CommonWorkflowEvent.REVISION);
  const canMakeDecision = checkCanMakeDecision({
    caseState,
    noAction,
    decision,
  });

  return !isLoadingRevision && canMakeDecision && (hasTaskReviewedEvent || hasRevisionEvent);
};
