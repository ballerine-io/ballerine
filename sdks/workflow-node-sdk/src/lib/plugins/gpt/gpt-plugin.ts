import { NodePlugin } from '../node-plugin';
import { PluginAction } from '@ballerine/workflow-core';
import { GPTParams, ModelConfig } from '../types';

export class GPTPlugin extends NodePlugin {
  #__modelConfig: ModelConfig;

  constructor({ name, stateNames, when, modelConfig }: GPTParams) {
    super(name, when, stateNames);
    this.isBlocking = true;
    this.#__modelConfig = modelConfig;
  }

  action({ workflowId, context, event, state }: PluginAction): Promise<void> {
    return new Promise(resolve => {
      const data = {
        context: context,
        state: state.value,
      };

      console.log('Saving into memory!');

      // this.#__store.put(workflowId, context.entityId, data);
      resolve('OK');
    });
  }

  //  action({ context }: { context: any; event: any; currentState: any }) {
  //   const { userId, wordflowId } = context;

  // }
}
