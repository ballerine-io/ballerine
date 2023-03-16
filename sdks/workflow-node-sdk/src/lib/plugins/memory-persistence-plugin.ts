import { StoreAdapter } from '../adapters/types';
import { NodePlugin } from './node-plugin';
import { PluginAction } from '@ballerine/workflow-core';
import { TPersistPluginParams } from './types';

/*
Should support the following
get all active user workflows
update by workflowId/userId
*/

export class MemoryPersistencePlugin extends NodePlugin {
  #__store: StoreAdapter;

  constructor({ name, stateNames, when, store }: TPersistPluginParams) {
    super(name, when, stateNames);
    this.isBlocking = true;
    this.#__store = store;
  }

  action({ workflowId, context, event, state }: PluginAction): Promise<void> {
    return new Promise(resolve => {
      const data = {
        context: context,
        state: state.value,
      };

      console.log('Saving into memory!');

      this.#__store.put(workflowId, context.entityId, data);
      resolve();
    });
  }

  //  action({ context }: { context: any; event: any; currentState: any }) {
  //   const { userId, wordflowId } = context;

  // }
}
