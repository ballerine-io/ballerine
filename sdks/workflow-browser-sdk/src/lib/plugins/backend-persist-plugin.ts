import { HttpError } from '@ballerine/workflow-core';
import { sleep } from '../utils';
import { StatePlugin } from './state-plugin';
import { IFetchOptions, TBackendPersistPluginParams } from './types';

export class BackendPersistPlugin extends StatePlugin {
  stateNames: Array<string>;
  name = 'SYNC_BACKEND';
  when: 'entry' | 'exit';
  #__fetchOptions: IFetchOptions;

  constructor({ stateNames, when, fetchOptions }: TBackendPersistPluginParams) {
    super();

    this.stateNames = stateNames;
    this.when = when;
    this.#__fetchOptions = fetchOptions;
  }

  async action({ context }: { context: any; event: any; currentState: any }): Promise<void> {
    const { baseUrl, endpoint, method, headers } = this.#__fetchOptions;
    const url = baseUrl ? new URL(endpoint, baseUrl) : endpoint;

    try {
      // Temporary - allows observing loading state
      await sleep(Math.round(Math.random() * 300));

      const res = await fetch(url, {
        method,
        body: method !== 'GET' ? JSON.stringify(context) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
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
