import { HttpError } from '@ballerine/workflow-core';
import { StatePlugin } from './state-plugin';
import { IFetchOptions, TBackendPersistPluginParams } from './types';

export class BackendPersistPlugin extends StatePlugin {
  stateNames: Array<string>;
  name = 'SYNC_BACKEND';
  when: 'pre' | 'post';
  isBlocking;
  #__fetchOptions: IFetchOptions;

  constructor({ stateNames, when, fetchOptions, isBlocking }: TBackendPersistPluginParams) {
    super();

    this.stateNames = stateNames;
    this.when = when;
    this.#__fetchOptions = fetchOptions;
    this.isBlocking = isBlocking ?? false;
  }

  async action({ context, state }: { context: any; event: any; state: any }): Promise<void> {
    const { baseUrl, endpoint, method, headers } = this.#__fetchOptions;
    // TODO: Find a way to mock global.URL
    const url = `${(baseUrl as string) || ''}${endpoint as string}`;

    try {
      const res = await fetch(url, {
        method,
        body: method !== 'GET' ? JSON.stringify({ context, state }) : undefined,
        headers,
      });

      if (!res.ok) {
        throw res;
      }
    } catch (err) {
      if (!(err instanceof Response)) {
        throw err;
      }

      throw new HttpError(err.status, `Response error - ${err.statusText} (${err.status})`, {
        cause: err,
      });
    }
  }
}
