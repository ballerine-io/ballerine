import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { CommonWorkflowEvent } from '@ballerine/common';

export function getPostRemoveDecisionEventName(workflow: TWorkflowById): string | undefined {
  if (!workflow?.workflowDefinition?.config?.workflowLevelResolution) {
    return CommonWorkflowEvent.RETURN_TO_REVIEW;
  }
}
