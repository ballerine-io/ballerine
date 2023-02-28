import { StatePlugin as TStatePlugin } from '@ballerine/workflow-core';

export interface IFetchOptions {
  baseUrl: URL | string;
  endpoint: URL | string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  headers?: HeadersInit;
}

export type TPersistPluginParams = Pick<TStatePlugin, 'stateNames'> & {
  fetchOptions: IFetchOptions;
};
