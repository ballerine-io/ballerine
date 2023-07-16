import { AnyObject } from '@ballerine/ui';
import { MachineConfig } from 'xstate';

export type SchemaBase = { states: AnyObject };

export type SchemaStates<TSchema extends SchemaBase> = keyof TSchema['states'];

export interface ViewStateContext<TContext = AnyObject, TStates = unknown> {
  next: (formData?: object) => void;
  prev: (formData?: object) => void;
  send: (type: TStates, formData?: object) => void;
  state: string;
  stateData: TContext;
}

export type ViewStateSchema = MachineConfig<any, any, any>;
