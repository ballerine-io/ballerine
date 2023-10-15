import { AnyObject } from '@ballerine/ui';
import { WorkflowBrowserSDK } from '@ballerine/workflow-browser-sdk';
import { useCallback, useMemo, useState } from 'react';

export interface StateMachineAPI {
  invokePlugin: (pluginName) => Promise<void>;
  sendEvent: (eventName: string) => Promise<void>;
  setContext: (newContext: AnyObject) => AnyObject;
  getContext: () => AnyObject;
  getState: () => string;
}

export const useMachineLogic = (
  machine: WorkflowBrowserSDK,
): { isInvokingPlugin: boolean; machineApi: StateMachineAPI } => {
  const [isInvokingPlugin, setInvokingPlugin] = useState(false);

  const invokePlugin = useCallback(
    async (pluginName: string) => {
      setInvokingPlugin(true);
      try {
        await machine.invokePlugin(pluginName);
      } catch (error) {
        console.log('Failed to invoke plugin', error.message);
      } finally {
        setInvokingPlugin(false);
      }
    },
    [machine],
  );

  const sendEvent = useCallback(
    async (eventName: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const eventsWithStates = machine.getSnapshot().machine.states[machine.getSnapshot().value]
        ?.config?.on as Record<string, Record<'target', string> | undefined>;
      const nextTransitionState = eventsWithStates?.[eventName];

      if (nextTransitionState) {
        const nextStateName = nextTransitionState.target;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        machine.overrideContext({ ...machine.getSnapshot().context, state: nextStateName });
      }

      await machine.sendEvent({ type: eventName });
    },
    [machine],
  );

  const setContext = useCallback(
    (newContext: AnyObject) => {
      machine.overrideContext(newContext);

      return newContext;
    },
    [machine],
  );

  const api: StateMachineAPI = useMemo(
    () => ({
      invokePlugin,
      sendEvent,
      setContext,
      getContext: () => machine.getSnapshot().context as AnyObject,
      getState: () => machine.getSnapshot().value as string,
    }),
    [invokePlugin, sendEvent, setContext, machine],
  );

  return {
    isInvokingPlugin,
    machineApi: api,
  };
};
