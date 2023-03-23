import { StatePlugin as IStatePlugin } from '@ballerine/workflow-core';

export interface IFetchOptions {
  baseUrl: URL | string;
  endpoint: URL | string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  headers?: HeadersInit;
}

export type TStatePluginParams = Omit<IStatePlugin, 'name' | 'action' | 'isBlocking'>;

export type TBackendPersistPluginParams = TStatePluginParams & {
  fetchOptions: IFetchOptions;
  isBlocking?: boolean;
};
