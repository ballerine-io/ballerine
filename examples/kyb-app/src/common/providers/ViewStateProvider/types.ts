import { IStep, StepMetadata } from '@app/common/hooks/useStepper';
import { AnyObject, InputsWarnings } from '@ballerine/ui';

export type SchemaBase = { states: AnyObject };

export type SchemaStates<TSchema extends SchemaBase> = keyof TSchema['states'];

export interface InitialContext<TSchema extends SchemaBase> {
  state: SchemaStates<TSchema>;
}

export interface StepperParams {
  currentStep: number;
  totalSteps: number;
}

export interface ViewStateContext<TGlobalContext = AnyObject> {
  next: () => void;
  prev: () => void;
  update: (data: object, shared?: object) => Promise<object>;
  save: <T>(data: T, shared?: object) => Promise<TGlobalContext>;
  saveAndPerformTransition: <T>(data: T, shared?: object) => Promise<TGlobalContext>;
  finish: (context: TGlobalContext) => void;
  context: TGlobalContext;
  state: string | number;
  steps: IStep[];
  stepper: StepperParams;
  warnings?: InputsWarnings;
  isFinished: boolean;
}

export interface View {
  label: string;
  key: string;
  active?: boolean;
  Component: React.ComponentType;
  meta?: StepMetadata;
  disableWrapper?: boolean;
  hidden?: boolean;
}
