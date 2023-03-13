import { NodePath } from '@babel/core';
import { HttpError } from '@ballerine/workflow-core';
import { StoreAdapter } from '../adapters/adapter';
import { MemoryStore } from '../adapters/memory-store';
import { NodePlugin, TPluginRunOrder } from './node-plugin';
import {PluginAction} from '@ballerine/workflow-core'

/*
Shoud support the folliwing
get all active user worklows
update by workflowId/userId
*/

type TPersistPluginParams = {
  name: string,
  stateNames: string[],
  when: TPluginRunOrder,
  store: StoreAdapter
};

export class MemoryPersistancePlugin extends NodePlugin {

  #__store: StoreAdapter; 

  constructor({ name, stateNames, when , store}: TPersistPluginParams) {
    super(name, when, stateNames);
    this.isBlocking = true;
    this.#__store = store;
  }

  action({workflowId, context, event, state}: PluginAction): Promise<void> {
    return new Promise((resolve) => {

      const data = {
        context: context,
        state: state.value
      };

      console.log('Saving into memory!')

      this.#__store.put(workflowId, context.entityId, data)
      resolve();
  });
  }

  //  action({ context }: { context: any; event: any; currentState: any }) {
  //   const { userId, wordflowId } = context;
    
  // }
}
