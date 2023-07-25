import { IStep, StepMetadata } from '@app/common/hooks/useStepper';
import { AnyObject } from '@ballerine/ui';
import { MachineConfig } from 'xstate';

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
  saveAndPerformTransition: (data: object, shared?: object) => Promise<void>;
  finish: (context: TGlobalContext) => void;
  context: TGlobalContext;
  state: string | number;
  steps: IStep[];
  stepper: StepperParams;
}

export type ViewStateSchema = MachineConfig<any, any, any>;

export interface View {
  label: string;
  key: string;
  active?: boolean;
  Component: React.ComponentType;
  meta?: StepMetadata;
}
