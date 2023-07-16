import { AnyObject } from '@ballerine/ui';
import { MachineConfig } from 'xstate';

export type SchemaBase = { states: AnyObject };

export type SchemaStates<TSchema extends SchemaBase> = keyof TSchema['states'];

export interface ViewStateContext<
  TGlobalContext = AnyObject,
  TViewContext = AnyObject,
  TStates = unknown,
> {
  next: () => void;
  prev: () => void;
  saveAndPerformTransition: (data: object, shared?: object) => void;
  send: (type: TStates, formData?: object) => void;
  state: string;
  stateData: TViewContext;
  context: TGlobalContext;
}

export type ViewStateSchema = MachineConfig<any, any, any>;
