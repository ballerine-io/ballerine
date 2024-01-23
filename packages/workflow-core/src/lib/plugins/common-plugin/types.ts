import { TContext, Transformers } from '../../utils';
import { SerializableValidatableTransformer } from '../external-plugin';
import { ChildPluginCallbackOutput } from '../../types';
import { AnyRecord } from '@ballerine/common';

export interface ISerializableCommonPluginParams
  extends Omit<IterativePluginParams, 'action' | 'iterateOn'> {
  iterateOn: Omit<SerializableValidatableTransformer, 'schema'>['transform'];
  response: SerializableValidatableTransformer;
  actionPluginName: string;

  invoke?(...args: Array<any>): any;
}

export interface ISerializableMappingPluginParams
  extends Omit<
    IterativePluginParams,
    'action' | 'iterateOn' | 'iterateOn' | 'action' | 'successAction' | 'errorAction'
  > {
  transformers: Omit<SerializableValidatableTransformer, 'schema'>['transform'];

  invoke?(...args: Array<any>): any;
}

export interface IterativePluginParams {
  name: string;
  stateNames: Array<string>;
  iterateOn: Transformers;
  action: (context: TContext) => Promise<any>;
  successAction?: string;
  errorAction?: string;
}

export interface ChildWorkflowPluginParams {
  name: string;
  parentWorkflowRuntimeId: string;
  parentWorkflowRuntimeConfig: AnyRecord;
  definitionId: string;
  stateNames?: Array<string>;
  transformers?: Transformers;
  initEvent?: string;
  action: (childCallbackInput: ChildPluginCallbackOutput) => Promise<void>;
}
