import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CommonWorkflowEvent, CommonWorkflowStates } from '@ballerine/common';

export const calculateWorkflowRevisionableEvent = (
  workflow: TWorkflowById,
  documentStatus: string,
) => {
  const isStateManualReview = workflow.state === CommonWorkflowStates.MANUAL_REVIEW;

  if (isStateManualReview) return CommonWorkflowEvent.REVISION;

  if (documentStatus === CommonWorkflowEvent.REVISION) {
    return CommonWorkflowEvent.REVISION;
  }

  console.error(
    `Missing Dispatchable Event WorkflowId: ${workflow.id} for documentStatus: ${documentStatus}`,
  );

  return documentStatus;
};
