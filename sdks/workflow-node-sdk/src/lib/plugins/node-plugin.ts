import { ExtensionRunOrder } from '@ballerine/workflow-core';
import { StatePlugin  } from '@ballerine/workflow-core';


``
export abstract class NodePlugin implements StatePlugin {
  name: string;
  when: ExtensionRunOrder;
  stateNames: string[];
  isBlocking: boolean;

  constructor(name: string, when: ExtensionRunOrder, stateNames: string[]) {
    this.name = name;
    this.when = when;
    this.stateNames = stateNames;
    this.isBlocking = true;
  }
 
  
  abstract action(
    options: Parameters<StatePlugin['action']>[0],
  ): ReturnType<StatePlugin['action']>;
}
