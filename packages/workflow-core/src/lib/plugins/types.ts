export type PluginAction = { workflowId: string; context: any; event: any; state: any };

export type ExtensionRunOrder = 'pre' | 'post';

export interface WorkflowPlugin {
  when: ExtensionRunOrder;
  action: (options: PluginAction) => Promise<void>;
}

export interface StatePlugin extends WorkflowPlugin {
  /**
   * The actions key to inject an action function into.
   * E.g. { actions: { [plugin.name]: plugin.action  } }
   */
  name: string;

  /**
   * Should the plugin be executed in a blocking manner or async
   */
  isBlocking: boolean;
  /**
   * States already defined in the statechart
   */
  stateNames: Array<string>;
}

export type StatePlugins = StatePlugin[];
