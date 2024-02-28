import { CommonWorkflowEvent, CommonWorkflowStates, StateTag } from '@ballerine/common';

export const generateBaseTaskLevelStates = () => ({
  [CommonWorkflowStates.MANUAL_REVIEW]: {
    tags: [StateTag.MANUAL_REVIEW],
    always: [
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
  [CommonWorkflowStates.REJECTED]: {
    tags: [StateTag.REJECTED],
    type: 'final',
  },
  [CommonWorkflowStates.APPROVED]: {
    tags: [StateTag.APPROVED],
    type: 'final',
  },
  [CommonWorkflowStates.RESOLVED]: {
    tags: [StateTag.RESOLVED],
    type: 'final',
  },
  [CommonWorkflowStates.REVISION]: {
    tags: [StateTag.REVISION],
    on: {
      [CommonWorkflowEvent.RETURN_TO_REVIEW]: CommonWorkflowStates.MANUAL_REVIEW,
    },
    always: {
      target: CommonWorkflowStates.MANUAL_REVIEW,
      cond: {
        type: 'jmespath',
        options: {
          rule: 'length(documents[?decision.status]) < length(documents)',
        },
      },
    },
  },
});
