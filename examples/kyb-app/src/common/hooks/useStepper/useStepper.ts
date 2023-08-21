import { useStepsRepository } from '@app/common/hooks/useStepper/hooks/useStepsManager';
import { overrideStepsAction } from '@app/common/hooks/useStepper/hooks/useStepsManager/actions';
import { IStep, StepperParams, UseStepperHookCallResult } from '@app/common/hooks/useStepper/types';
import { useCallback, useEffect, useMemo } from 'react';

export function useStepper(_steps: IStep[], params: StepperParams): UseStepperHookCallResult {
  const { state, actions, dispatch } = useStepsRepository({
    activeStep: params.initialStepIndex || 0,
    steps: _steps,
    meta: {},
  });

  useEffect(() => {
    dispatch(overrideStepsAction(_steps));
  }, [_steps, actions.overrideStepsAction, dispatch]);

  const {
    prevStepAction,
    nextStepAction,
    completeCurrentStepAction,
    invalidateStepAction,
    warningStepAction,
    updateStepDataAction,
  } = actions;

  const currentStep = useMemo(() => {
    return state.steps[state.activeStep];
  }, [state.steps, state.activeStep]);

  const prevStep = useCallback(() => {
    const predictedNextStep = state.steps[state.activeStep - 1];

    dispatch(prevStepAction());

    return predictedNextStep ? predictedNextStep : null;
  }, [prevStepAction, dispatch]);

  const nextStep = useCallback((): IStep | null => {
    const predictedNextStep = state.steps[state.activeStep + 1];

    dispatch(nextStepAction());

    return predictedNextStep ? predictedNextStep : null;
  }, [state.steps, state.activeStep, nextStepAction, dispatch]);

  const completeCurrent = useCallback(() => {
    dispatch(completeCurrentStepAction());
  }, [completeCurrentStepAction, dispatch]);

  const invalidate = useCallback(
    (index: number, reason?: string) => {
      dispatch(invalidateStepAction(index, reason));
    },
    [invalidateStepAction, dispatch],
  );

  const warning = useCallback(
    (index: number, reason?: string) => {
      dispatch(warningStepAction(index, reason));
    },
    [warningStepAction, dispatch],
  );

  const update = useCallback(
    (stepIndex: number, payload: object) => {
      dispatch(updateStepDataAction(stepIndex, payload));
    },
    [updateStepDataAction, dispatch],
  );

  return {
    currentStep,
    steps: state.steps,
    prevStep,
    nextStep,
    invalidate,
    warning,
    completeCurrent,
    update,
  };
}
