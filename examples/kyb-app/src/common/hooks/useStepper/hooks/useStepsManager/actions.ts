import {
  CompleteCurrentStepActionPayload,
  InvalidateStepActionPayload,
  NextStepActionPayload,
  PrevStepActionPayload,
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

export const nextStepAction = (): NextStepActionPayload => ({ type: 'NEXT' });

export const prevStepAction = (): PrevStepActionPayload => ({ type: 'PREV' });
