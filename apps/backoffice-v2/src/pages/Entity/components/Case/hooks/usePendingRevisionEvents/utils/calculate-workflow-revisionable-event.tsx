import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CommonWorkflowEvent } from '@ballerine/common';

export const calculateWorkflowRevisionableEvent = (
  workflow: TWorkflowById,
  documentStatus: string,
) => {
  const hasTaskReviewedEvent = Boolean(
    workflow?.nextEvents?.includes(CommonWorkflowEvent.TASK_REVIEWED),
  );

  if (hasTaskReviewedEvent) return hasTaskReviewedEvent;

  if (documentStatus === CommonWorkflowEvent.REVISION) {
    return CommonWorkflowEvent.REVISION;
  }

  console.error(
    `Missing Dispatchable Event WorkflowId: ${workflow.id} for documentStatus: ${documentStatus}`,
  );

  return documentStatus;
};
