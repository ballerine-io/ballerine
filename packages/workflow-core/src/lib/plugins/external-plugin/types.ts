import { TJsonSchema, Transformers, Validator } from '../../utils';
import { THelperFormatingLogic } from '../../utils/context-transformers/types';
import { ActionablePlugin } from '../types';
import { ChildWorkflowPluginParams } from '../common-plugin/types';

export interface ValidatableTransformer {
  transformers: Transformers;
  schemaValidator?: Validator;
}
export interface IApiPluginParams {
  name: string;
  pluginKind?: string;
  stateNames: Array<string>;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  request: ValidatableTransformer;
  response?: ValidatableTransformer;
  headers?: HeadersInit;
  successAction?: string;
  errorAction?: string;
  persistResponseDestination?: string;
  options?: { responseSliceOptions?: { fromText: string; toText: string } };

  invoke?(...args: Array<any>): any;
}
export interface WebhookPluginParams {
  name: string;
  pluginKind: string;
  stateNames: Array<string>;
  url: string;
  method: IApiPluginParams['method'];
  headers: IApiPluginParams['headers'];
  request: Omit<IApiPluginParams['request'], 'schemaValidator'>;
}

export interface IterativePluginParams {
  name: string;
  pluginKind: string;
  stateNames: Array<string>;
  iterateOn: Omit<IApiPluginParams['request'], 'schemaValidator'>;
  actionPlugin: ActionablePlugin;
  successAction?: string;
  errorAction?: string;

  invoke?(...args: Array<any>): any;
}

export interface SerializableValidatableTransformer {
  transform: Array<{
    transformer: string;
    mapping: string | THelperFormatingLogic;
  }>;
  schema?: TJsonSchema;
}

export interface ISerializableHttpPluginParams
  extends Omit<IApiPluginParams, 'request' | 'response'> {
  request: SerializableValidatableTransformer;
  response: SerializableValidatableTransformer;

  invoke?(...args: Array<any>): any;
}

export interface SerializableWebhookPluginParams extends Omit<WebhookPluginParams, 'request'> {
  name: string;
  stateNames: Array<string>;
  url: string;
  method: ISerializableHttpPluginParams['method'];
  headers: ISerializableHttpPluginParams['headers'];
  request: SerializableValidatableTransformer;
}

export interface ISerializableChildPluginParams
  extends Omit<ChildWorkflowPluginParams, 'action' | 'transformers' | 'parentWorkflowRuntimeId'> {
  pluginKind: string;
  transformers: Omit<SerializableValidatableTransformer, 'schema'>['transform'];

  invoke?(...args: Array<any>): Promise<any>;
}

export interface SerializableIterativePluginParams {
  name: string;
  stateNames: Array<string>;
  iterateOn: Omit<SerializableValidatableTransformer['transform'], 'schema'>;
  successAction?: string;
  errorAction?: string;

  invoke?(...args: any): void;
}
