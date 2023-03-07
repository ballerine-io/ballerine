import { StatePlugin, GlobalPlugin  } from '@ballerine/workflow-core';

export type TPluginRunOrder = 'pre' | 'post'



export abstract class NodePlugin implements GlobalPlugin {
  name: string;
  when: TPluginRunOrder;
  stateName: string = "";

  constructor(name: string, when: TPluginRunOrder, stateNames: string[]) {
    this.name = name;
    this.when = when;
  }
  
  abstract action(
    options: Parameters<StatePlugin['action']>[0],
  ): ReturnType<StatePlugin['action']>;
}
