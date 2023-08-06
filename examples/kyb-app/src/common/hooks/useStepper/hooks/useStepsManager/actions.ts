import {
  CompleteCurrentStepActionPayload,
  InvalidateStepActionPayload,
  NextStepActionPayload,
  PrevStepActionPayload,
  UpdateStepDataAction,
  WarningStepActionPayload,
} from '@app/common/hooks/useStepper/hooks/useStepsManager/types';

export const completeCurrentStepAction = (): CompleteCurrentStepActionPayload => ({
  type: 'COMPLETE-CURRENT',
});

export const invalidateStepAction = (
  stepIndex: number,
  reason?: string,
): InvalidateStepActionPayload => ({ type: 'INVALIDATE', stepIndex, reason });

export const warningStepAction = (
  stepIndex: number,
  reason?: string,
): WarningStepActionPayload => ({ type: 'WARNING', stepIndex, reason });

export const updateStepDataAction = (stepIndex: number, payload: object): UpdateStepDataAction => ({
  type: 'UPDATE-DATA',
  stepIndex,
  payload,
});

export const nextStepAction = (): NextStepActionPayload => ({ type: 'NEXT' });

export const prevStepAction = (): PrevStepActionPayload => ({ type: 'PREV' });
