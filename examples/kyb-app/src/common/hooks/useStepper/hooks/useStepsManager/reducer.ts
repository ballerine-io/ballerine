import {
  StepsManagerActions,
  StepsRepositoryState,
} from '@app/common/hooks/useStepper/hooks/useStepsManager/types';

const initialState: StepsRepositoryState = {
  activeStep: 0,
  steps: [],
  meta: {},
};

export function stepsRepisotoryReducer(
  state = initialState,
  action: StepsManagerActions,
): StepsRepositoryState {
  if (action.type === 'NEXT') {
    const nextStepIndex = state.activeStep + 1;
    const isInRange = Boolean(state.steps[nextStepIndex]);

    return {
      ...state,
      activeStep: isInRange ? nextStepIndex : state.activeStep,
    };
  }

  if (action.type === 'PREV') {
    const prevStepIndex = state.activeStep - 1;
    const isInRange = Boolean(state.steps[prevStepIndex]);

    return {
      ...state,
      activeStep: isInRange ? prevStepIndex : state.activeStep,
    };
  }

  if (action.type === 'COMPLETE-CURRENT') {
    return {
      ...state,
      steps: state.steps.map(step =>
        step.index === state.activeStep
          ? { ...step, meta: { ...step.meta, status: 'completed' } }
          : step,
      ),
    };
  }

  if (action.type === 'INVALIDATE') {
    const { reason, stepIndex } = action;

    return {
      ...state,
      meta: {
        ...state.meta,
        [stepIndex]: {
          ...state.meta[stepIndex],
          status: 'error',
          errorReason: reason,
        },
      },
    };
  }

  if (action.type === 'WARNING') {
    const { reason, stepIndex } = action;

    return {
      ...state,
      meta: {
        ...state,
        [stepIndex]: {
          ...state.meta[stepIndex],
          status: 'warning',
          warningReason: reason,
        },
      },
    };
  }

  return state;
}
