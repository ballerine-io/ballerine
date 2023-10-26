import { CommonWorkflowEvent, CommonWorkflowStates, StateTag } from '@ballerine/common';

export const generateBaseCaseLevelStates = (
  defaultState: string = CommonWorkflowStates.MANUAL_REVIEW,
  defaultResubmitEvent: string = CommonWorkflowEvent.RETURN_TO_REVIEW,
) => ({
  [defaultState]: {
    tags: [StateTag.MANUAL_REVIEW],
    on: {
      [CommonWorkflowStates.REJECTED]: { target: CommonWorkflowStates.REJECTED },
      [CommonWorkflowStates.APPROVED]: { target: CommonWorkflowStates.APPROVED },
      [CommonWorkflowStates.REVISION]: { target: CommonWorkflowStates.REVISION },
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
    on: {
      [defaultResubmitEvent]: defaultState,
    },
  },
});
