import { CommonWorkflowEvent, CommonWorkflowStates, StateTag } from '@ballerine/common';

export const generateBaseCaseLevelStates = (
  defaultState: string = CommonWorkflowStates.MANUAL_REVIEW,
  defaultResubmitEvent: string = CommonWorkflowEvent.RETURN_TO_REVIEW,
) =>
  ({
    [defaultState]: {
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
        [defaultResubmitEvent]: defaultState,
      },
    },
  } as const);

export const generateBaseCaseLevelStatesAutoTransitionOnRevision = (
  defaultState: string = CommonWorkflowStates.MANUAL_REVIEW,
  defaultResubmitEvent: string = CommonWorkflowEvent.RETURN_TO_REVIEW,
) => {
  const definition = generateBaseCaseLevelStates(defaultState, defaultResubmitEvent);

  return {
    ...definition,
    [CommonWorkflowStates.REVISION]: {
      ...definition[CommonWorkflowStates.REVISION],
      on: {
        ...definition[CommonWorkflowStates.REVISION].on,
      },
      always: {
        target: defaultState,
        cond: {
          type: 'jmespath',
          options: {
            rule: 'length(documents[?decision.status]) < length(documents)',
          },
        },
      },
    },
  };
};
