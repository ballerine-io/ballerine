import { StepStatus } from '@app/components/atoms/Stepper/types';

export type StepIndex = number;

export interface IStep<TStatus = StepStatus> {
  index: StepIndex;
  label: string;
  status: TStatus;
  dataAlias?: string;
}

export interface Step extends IStep {
  status: StepStatus;
  isCurrent?: boolean;
}

export interface IStepError extends IStep {
  reason: string;
}

export type StepperStatusesMap<T> = Record<StepStatus, T>;

export interface StepMetadata {
  warningReason?: string;
  errorReason?: string;
  data?: object;
}

export interface StepperParams {
  initialStepIndex?: StepIndex;
  initialMeta?: Record<StepIndex, StepMetadata>;
}

export interface UseStepperHookCallResult {
  steps: IStep<StepStatus>[];
  currentStep: IStep<StepStatus>;
  prevStep: () => void;
  nextStep: () => void;
  completeCurrent: () => void;
}
