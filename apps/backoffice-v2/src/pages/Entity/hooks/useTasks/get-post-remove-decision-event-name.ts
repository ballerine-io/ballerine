import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { CommonWorkflowEvent } from '@ballerine/common';

export function getPostRemoveDecisionEventName(workflow: TWorkflowById): string | undefined {
  if (
    !workflow?.workflowDefinition?.config?.workflowLevelResolution &&
    workflow?.nextEvents?.includes(CommonWorkflowEvent.TASK_REVIEWED)
  ) {
    return CommonWorkflowEvent.RETURN_TO_REVIEW;
  }
}
