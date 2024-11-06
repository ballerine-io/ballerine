import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { isErrorWithMessage } from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';
import { WorkflowBrowserSDK } from '@ballerine/workflow-browser-sdk';
import { useCallback, useMemo, useState } from 'react';

export interface StateMachineAPI {
  invokePlugin: (pluginName: string) => Promise<void>;
  sendEvent: (eventName: string) => Promise<void>;
  setContext: (newContext: CollectionFlowContext) => CollectionFlowContext;
  getContext: () => CollectionFlowContext;
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
        console.log('Failed to invoke plugin', isErrorWithMessage(error) ? error.message : error);
      } finally {
        setInvokingPlugin(false);
      }
    },
    [machine],
  );

  const sendEvent = useCallback(
    async (eventName: string) => {
      const eventsWithStates = machine.getSnapshot().machine.states[machine.getSnapshot().value]
        ?.config?.on as Record<string, Record<'target', string> | undefined>;
      const nextTransitionState = eventsWithStates?.[eventName];

      if (nextTransitionState) {
        const context = machine.getSnapshot().context as AnyObject;

        machine.overrideContext({
          ...context,
        });
      }

      await machine.sendEvent({ type: eventName });
    },
    [machine],
  );

  const setContext = useCallback(
    (newContext: CollectionFlowContext) => {
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
      getContext: () => machine.getSnapshot().context as CollectionFlowContext,
      getState: () => machine.getSnapshot().value as string,
    }),
    [invokePlugin, sendEvent, setContext, machine],
  );

  return {
    isInvokingPlugin,
    machineApi: api,
  };
};
