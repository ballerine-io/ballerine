import { StepStatus } from '@app/components/atoms/Stepper/types';

export type StepIndex = number;

export interface StepMetadata {
  status?: Exclude<StepStatus, 'current'>;
  warningReason?: string;
  errorReason?: string;
}

export interface IStep {
  index: StepIndex;
  label: string;
  dataAlias: string;
  meta: StepMetadata;
}

export interface Step extends IStep {
  status: StepStatus;
  isCurrent?: boolean;
}

export interface IStepError extends IStep {
  reason: string;
}

export type StepperStatusesMap<T> = Record<StepStatus, T>;

export interface StepperParams {
  initialStepIndex?: StepIndex;
  initialMeta?: Record<StepIndex, StepMetadata>;
}

export interface UseStepperHookCallResult {
  steps: IStep[];
  currentStep: IStep;
  prevStep: () => void;
  nextStep: () => void;
  warning: (index: number, reason?: string) => void;
  invalidate: (index: number, reason?: string) => void;
  update: (index: number, payload: object) => void;
  completeCurrent: () => void;
}
