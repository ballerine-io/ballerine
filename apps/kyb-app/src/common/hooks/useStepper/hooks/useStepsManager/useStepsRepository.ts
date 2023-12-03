import {
  completeCurrentStepAction,
  invalidateStepAction,
  warningStepAction,
  prevStepAction,
  nextStepAction,
  updateStepDataAction,
  overrideStepsAction,
} from '@/common/hooks/useStepper/hooks/useStepsManager/actions';
import { stepsRepisotoryReducer } from '@/common/hooks/useStepper/hooks/useStepsManager/reducer';
import { StepsRepositoryState } from '@/common/hooks/useStepper/hooks/useStepsManager/types';
import { useReducer } from 'react';

export const useStepsRepository = (initialState: StepsRepositoryState) => {
  const [state, dispatch] = useReducer(stepsRepisotoryReducer, initialState);

  return {
    state,
    actions: {
      completeCurrentStepAction,
      prevStepAction,
      nextStepAction,
      invalidateStepAction,
      warningStepAction,
      updateStepDataAction,
      overrideStepsAction,
    },
    dispatch,
  };
};
