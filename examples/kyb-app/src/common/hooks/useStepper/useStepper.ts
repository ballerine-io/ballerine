import { useStepsRepository } from '@app/common/hooks/useStepper/hooks/useStepsManager';
import { IStep, StepperParams, UseStepperHookCallResult } from '@app/common/hooks/useStepper/types';
import { useCallback, useMemo } from 'react';

export function useStepper(_steps: IStep[], params: StepperParams): UseStepperHookCallResult {
  const { state, actions, dispatch } = useStepsRepository({
    activeStep: params.initialStepIndex || 0,
    steps: _steps,
    meta: {},
  });

  const currentStep = useMemo(() => {
    const current = state.steps.find(step => step.status === 'current');

    if (current) return current;

    const completed = state.steps.find(step => step.status === 'completed');
    if (completed) return completed;

    const idleFallback = state.steps.find(step => step.status === 'idle');

    return idleFallback;
  }, [state.steps]);

  const prevStep = useCallback(() => {
    dispatch(actions.prevStepAction());
  }, [actions.prevStepAction, dispatch]);

  const nextStep = useCallback(() => {
    dispatch(actions.nextStepAction());
  }, [actions.nextStepAction, dispatch]);

  const completeCurrent = useCallback(() => {
    dispatch(actions.completeCurrentStepAction());
  }, [actions.completeCurrentStepAction, dispatch]);

  const invalidate = useCallback(
    (index: number, reason?: string) => {
      dispatch(actions.invalidateStepAction(index, reason));
    },
    [actions.invalidateStepAction, dispatch],
  );

  const warning = useCallback(
    (index: number, reason?: string) => {
      dispatch(actions.warningStepAction(index, reason));
    },
    [actions.warningStepAction, dispatch],
  );

  return {
    currentStep,
    steps: state.steps,
    prevStep,
    nextStep,
    completeCurrent,
  };
}
