import { IStep, StepIndex, StepMetadata } from '@app/common/hooks/useStepper/types';
import { StepStatus } from '@app/components/atoms/Stepper/types';

export interface StepsRepositoryState {
  activeStep: number;
  steps: IStep<StepStatus>[];
  meta: Record<StepIndex, StepMetadata>;
}

export type ActionTypes = 'COMPLETE-CURRENT' | 'NEXT' | 'PREV' | 'WARNING' | 'INVALIDATE';

export interface Action {
  type: ActionTypes;
}

export interface CompleteCurrentStepActionPayload {
  type: 'COMPLETE-CURRENT';
  data?: object;
}

export interface NextStepActionPayload {
  type: 'NEXT';
}

export interface PrevStepActionPayload {
  type: 'PREV';
}

export interface WarningStepActionPayload {
  type: 'WARNING';
  stepIndex: number;
  reason?: string;
}

export interface InvalidateStepActionPayload {
  type: 'INVALIDATE';
  stepIndex: number;
  reason?: string;
}

export type StepsManagerActions =
  | CompleteCurrentStepActionPayload
  | NextStepActionPayload
  | PrevStepActionPayload
  | WarningStepActionPayload
  | InvalidateStepActionPayload;
