import { StatePlugin } from './state-plugin';
import { TStatePluginParams } from './types';

export class LocalStoragePersistPlugin extends StatePlugin {
  stateNames: Array<string>;
  name = 'SYNC_LOCAL_STORAGE';
  when: 'pre' | 'post';
  isBlocking = false;

  constructor({ stateNames, when }: TStatePluginParams) {
    super();

    this.stateNames = stateNames;
    this.when = when;
  }

  async action({ context, state }: { context: any; event: any; state: any }): Promise<void> {
    return new Promise<void>(resolve => {
      try {
        // localStorage key could be configurable or stored as a constant.
        localStorage.setItem('workflow-context', JSON.stringify({ context, state }));

        resolve();
      } catch (err) {
        // TODO: Create a custom error type.
        throw new Error(`Failed to persist state to localStorage`, {
          cause: err,
        });
      }
    });
  }
}
