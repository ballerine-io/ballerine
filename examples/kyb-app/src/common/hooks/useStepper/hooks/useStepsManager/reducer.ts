import {
  StepsManagerActions,
  StepsRepositoryState,
} from '@app/common/hooks/useStepper/hooks/useStepsManager/types';
import { StepStatus } from '@app/components/atoms/Stepper/types';

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

    return {
      ...state,
      steps: state.steps
        .map((step, index) => ({
          ...step,
          status: (state.activeStep === index && step.status === 'completed'
            ? step.status
            : 'idle') as StepStatus,
        }))
        .map((step, index) => ({
          ...step,
          status: index === nextStepIndex ? 'current' : step.status,
        })),
      activeStep: state.activeStep + 1,
    };
  }

  if (action.type === 'PREV') {
    return {
      ...state,
      steps: state.steps.map((step, index) => ({
        ...step,
        status: index === state.activeStep - 1 ? 'current' : 'idle',
      })),
      activeStep: state.activeStep - 1,
    };
  }

  if (action.type === 'COMPLETE-CURRENT') {
    return {
      ...state,
      meta: {
        ...state.meta,
        [state.activeStep]: {
          data: action.data,
        },
      },
      steps: state.steps.map((step, index) => ({
        ...step,
        status: state.activeStep === index ? 'completed' : step.status,
      })),
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
          warningReason: reason,
        },
      },
    };
  }

  return state;
}
