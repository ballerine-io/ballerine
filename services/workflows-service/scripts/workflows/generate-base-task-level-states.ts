import { CommonWorkflowEvent, CommonWorkflowStates, StateTag } from '@ballerine/common';

export const generateBaseTaskLevelStates = (
  defaultState: string = CommonWorkflowStates.MANUAL_REVIEW,
  defaultResubmitEvent: string = CommonWorkflowEvent.RETURN_TO_REVIEW,
) => ({
  [defaultState]: {
    tags: [StateTag.MANUAL_REVIEW],
    on: {
      TASK_REVIEWED: [
        {
          target: CommonWorkflowStates.APPROVED,
          cond: {
            type: 'jmespath',
            options: {
              rule: "length(documents[?decision.status]) == length(documents) && length(documents) > `0` && length(documents[?decision.status == 'approved']) == length(documents)",
            },
          },
        },
        {
          target: CommonWorkflowStates.REJECTED,
          cond: {
            type: 'jmespath',
            options: {
              rule: "length(documents[?decision.status]) == length(documents) && length(documents) > `0` && length(documents[?decision.status == 'rejected']) > `0`",
            },
          },
        },
        {
          target: CommonWorkflowStates.REVISION,
          cond: {
            type: 'jmespath',
            options: {
              rule: "length(documents[?decision.status]) == length(documents) && length(documents) > `0` && length(documents[?decision.status == 'revision']) > `0`",
            },
          },
        },
      ],
    },
  },
  rejected: {
    tags: [StateTag.REJECTED],
    type: 'final',
  },
  approved: {
    tags: [StateTag.APPROVED],
    type: 'final',
  },
  resolved: {
    tags: [StateTag.RESOLVED],
    type: 'final',
  },
  revision: {
    tags: [StateTag.REVISION],
    type: 'final',
  },
});
