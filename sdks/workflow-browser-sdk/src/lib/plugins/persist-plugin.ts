import { HttpError } from '@ballerine/workflow-core';
import { StatePlugin } from './state-plugin';
import { IFetchOptions, TPersistPluginParams } from './types';

export class PersistPlugin extends StatePlugin {
  stateNames: Array<string>;
  name = 'persist';
  when: 'entry' | 'exit' = 'entry';
  #__fetchOptions: IFetchOptions;

  constructor({ stateNames, fetchOptions }: TPersistPluginParams) {
    super();

    this.stateNames = stateNames;
    this.#__fetchOptions = fetchOptions;
  }

  async action({ context }: { context: any; event: any; currentState: any }): Promise<void> {
    const { baseUrl, endpoint, method, headers } = this.#__fetchOptions;
    const url = baseUrl ? new URL(endpoint, baseUrl) : endpoint;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch(url, {
        method,
        body: JSON.stringify(context),
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

      throw new HttpError(err.status, `Response error: ${err.statusText} (${err.status})`, {
        cause: err,
      });
    }
  }
}
