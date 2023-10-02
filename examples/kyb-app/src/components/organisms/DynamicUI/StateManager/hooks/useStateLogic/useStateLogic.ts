import { AnyObject } from '@ballerine/ui';
import { WorkflowBrowserSDK } from '@ballerine/workflow-browser-sdk';
import { useCallback, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';

type ContextPayload = AnyObject;

interface State {
  machineState: string;
  payload: ContextPayload;
}

export const useStateLogic = (machineApi: StateMachineAPI, machine: WorkflowBrowserSDK) => {
  const [contextPayload, _setContext] = useState<State>(() => ({
    machineState: machine.getSnapshot().value as string,
    payload: machine.getSnapshot().context as ContextPayload,
  }));
  const contextRef = useRef<ContextPayload>(contextPayload);

  const setContext = useCallback(
    (newContext: AnyObject) => {
      const newCtx = { ...newContext };
      machine.overrideContext(newCtx);

      _setContext(prev => ({ ...prev, payload: newCtx }));
      contextRef.current = newCtx;

      return newCtx;
    },
    [machine, contextRef],
  );

  const invokePlugin = useCallback(
    async (pluginName: string) => {
      await machine.invokePlugin(pluginName);

      const snapshot = machine.getSnapshot();

      _setContext({
        machineState: snapshot.value as string,
        payload: snapshot.context as ContextPayload,
      });
    },
    [machine],
  );

  const sendEvent = useCallback(
    async (eventName: string) => {
      await machine.sendEvent({ type: eventName });

      const snapshot = machine.getSnapshot();

      if (!isEqual(snapshot.context, contextRef.current)) {
        _setContext({
          machineState: snapshot.value as string,
          payload: snapshot.context as ContextPayload,
        });
      }

      _setContext(prev => ({ ...prev, machineState: snapshot.value as string }));
    },
    [machine, contextRef],
  );

  const getContext = useCallback(() => machine.getSnapshot().context as AnyObject, [machine]);

  return {
    contextPayload: contextPayload.payload,
    state: contextPayload.machineState,
    invokePlugin,
    setContext,
    sendEvent,
    getContext,
  };
};
