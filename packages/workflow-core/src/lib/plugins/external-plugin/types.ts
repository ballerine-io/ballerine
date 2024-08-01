import { TJsonSchema, Transformers, Validator } from '../../utils';
import { THelperFormatingLogic } from '../../utils/context-transformers/types';
import { ActionablePlugin } from '../types';

import { AnyRecord } from '@ballerine/common';
import { SecretsManager } from '@/lib/types';

export interface ValidatableTransformer {
  transformers?: Transformers;
  schemaValidator?: Validator;
}
export interface IApiPluginParams {
  name: string;
  pluginKind?: string;
  stateNames: string[];
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  request?: ValidatableTransformer;
  response?: ValidatableTransformer;
  headers?: HeadersInit;
  successAction?: string;
  errorAction?: string;
  persistResponseDestination?: string;
  displayName: string | undefined;
  secretsManager?: SecretsManager;

  invoke?(...args: any[]): any;
}

export interface IDispatchEventPluginParams {
  name: string;
  eventName: string;
  payload?: AnyRecord;
  stateNames: string[];
  displayName?: string;
  errorAction?: string;
  successAction?: string;
  transformers?: SerializableValidatableTransformer['transform'];
}

export interface WebhookPluginParams {
  name: string;
  pluginKind: string;
  stateNames: string[];
  url: string;
  method: IApiPluginParams['method'];
  headers: IApiPluginParams['headers'];
  request: Omit<IApiPluginParams['request'], 'schemaValidator'>;
}

export interface IterativePluginParams {
  name: string;
  pluginKind: string;
  stateNames: string[];
  iterateOn: Omit<IApiPluginParams['request'], 'schemaValidator'>;
  actionPlugin: ActionablePlugin;
  successAction?: string;
  errorAction?: string;

  invoke?(...args: any[]): any;
}

export interface SerializableValidatableTransformer {
  transform: Array<{
    transformer: string;
    mapping: string | THelperFormatingLogic;
  }>;
  schema?: TJsonSchema;
}

export interface ISerializableHttpPluginParams extends IApiPluginParams {
  invoke?(...args: any[]): any;
}

export interface SerializableWebhookPluginParams extends Omit<WebhookPluginParams, 'request'> {
  name: string;
  stateNames: string[];
  url: string;
  method: ISerializableHttpPluginParams['method'];
  headers: ISerializableHttpPluginParams['headers'];
  request: SerializableValidatableTransformer;
}

export interface SerializableIterativePluginParams {
  name: string;
  stateNames: string[];
  successAction?: string;
  errorAction?: string;
  iterateOn: SerializableValidatableTransformer['transform'];

  invoke?(...args: any): void;
}
