import { CommonWorkflowEvent, CommonWorkflowStates, StateTag } from '@ballerine/common';

export const generateBaseCaseLevelStates = () => ({
  [CommonWorkflowStates.MANUAL_REVIEW]: {
    tags: [StateTag.MANUAL_REVIEW],
    on: {
      [CommonWorkflowEvent.REJECT]: { target: CommonWorkflowStates.REJECTED },
      [CommonWorkflowEvent.APPROVE]: { target: CommonWorkflowStates.APPROVED },
      [CommonWorkflowEvent.REVISION]: { target: CommonWorkflowStates.REVISION },
    },
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
      '*': {
        target: CommonWorkflowStates.MANUAL_REVIEW,
        cond: {
          type: 'jmespath',
          options: {
            rule: 'length(documents[?decision.status]) < length(documents)',
          },
        },
      },
    },
  },
});
