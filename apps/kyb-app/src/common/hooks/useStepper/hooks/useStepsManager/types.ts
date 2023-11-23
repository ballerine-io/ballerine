import { IStep, StepIndex, StepMetadata } from '@/common/hooks/useStepper/types';

export interface StepsRepositoryState {
  activeStep: number;
  steps: IStep[];
  meta: Record<StepIndex, StepMetadata>;
}

export type ActionTypes =
  | 'COMPLETE-CURRENT'
  | 'NEXT'
  | 'PREV'
  | 'WARNING'
  | 'INVALIDATE'
  | 'UPDATE-DATA';

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

export interface UpdateStepDataAction {
  type: 'UPDATE-DATA';
  stepIndex: number;
  payload: object;
}

export interface OverrideStepsAction {
  type: 'STEPS_OVERRIDE';
  payload: IStep[];
}

export type StepsManagerActions =
  | CompleteCurrentStepActionPayload
  | NextStepActionPayload
  | PrevStepActionPayload
  | WarningStepActionPayload
  | InvalidateStepActionPayload
  | UpdateStepDataAction
  | OverrideStepsAction;
