import type { StatePlugin as TStatePlugin } from '@ballerine/workflow-core';

export abstract class StatePlugin {
  /**
   * When to execute the plugin.
   */
  abstract when: TStatePlugin['when'];
  /**
   * An identifier for the plugin. Used to correlate between a key and its function.
   */
  abstract name: TStatePlugin['name'];
  /**
   * Allows execution of the same plugin for more than one state.
   */
  abstract stateNames: TStatePlugin['stateNames'];
  /**
   * With isBlocking `true` plugins are executed pre/post the `service.send` call depending on {@link StatePlugin.when} instead of being injected as an action.
   */
  abstract isBlocking: TStatePlugin['isBlocking'];

  /**
   * An async function that is executed when the plugin is triggered.
   * @param options - Exposes the current state, event, and context.
   * @returns Promise<void>
   */
  abstract action(
    options: Parameters<TStatePlugin['action']>[0],
  ): ReturnType<TStatePlugin['action']>;
}
