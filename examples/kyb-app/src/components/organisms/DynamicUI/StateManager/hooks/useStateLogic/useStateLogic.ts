import { AnyObject } from '@ballerine/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { getAccessToken } from '@app/helpers/get-access-token.helper';

type ContextPayload = AnyObject;

interface State {
  machineState: string;
  payload: ContextPayload;
}

export const useStateLogic = (machineApi: StateMachineAPI) => {
  useEffect(() => {
    machineApi.setContext({
      ...machineApi.getContext(),
      flowConfig: { apiUrl: `http://${new URL(import.meta.env.VITE_API_URL as string).host}` },
      tokenId: getAccessToken(),
    });
  }, []);

  const [contextPayload, _setContext] = useState<State>(() => ({
    machineState: machineApi.getState(),
    payload: machineApi.getContext(),
  }));
  const contextRef = useRef<ContextPayload>(contextPayload);

  const setContext = useCallback(
    (newContext: AnyObject) => {
      const newCtx = { ...newContext };
      machineApi.setContext(newCtx);

      _setContext(prev => ({ ...prev, payload: newCtx }));
      contextRef.current = newCtx;

      return newCtx;
    },
    [machineApi, contextRef],
  );

  const invokePlugin = useCallback(
    async (pluginName: string) => {
      await machineApi.invokePlugin(pluginName);

      _setContext({
        machineState: machineApi.getState(),
        payload: machineApi.getContext(),
      });
    },
    [machineApi],
  );

  const sendEvent = useCallback(
    async (eventName: string) => {
      await machineApi.sendEvent(eventName);

      if (!isEqual(machineApi.getContext(), contextRef.current)) {
        _setContext({
          machineState: machineApi.getState(),
          payload: machineApi.getContext(),
        });
      }

      _setContext(prev => ({ ...prev, machineState: machineApi.getState() }));
    },
    [machineApi, contextRef],
  );

  const getContext = useCallback(() => machineApi.getContext(), [machineApi]);

  const getState = useCallback(() => machineApi.getState(), [machineApi]);

  return {
    contextPayload: contextPayload.payload,
    state: contextPayload.machineState,
    invokePlugin,
    setContext,
    sendEvent,
    getContext,
    getState,
  };
};
