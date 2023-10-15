import { AnyObject } from '@ballerine/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { getAccessToken } from '@app/helpers/get-access-token.helper';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';

type ContextPayload = AnyObject;

interface State {
  machineState: string;
  payload: ContextPayload;
}

export const useStateLogic = (machineApi: StateMachineAPI, initialContext = {}) => {
  const [contextPayload, _setContext] = useState<State>(() => ({
    machineState: machineApi.getState(),
    payload: machineApi.getContext(),
  }));

  const contextRef = useRef<ContextPayload>(contextPayload);
  const { helpers } = useDynamicUIContext();
  const host = new URL(import.meta.env.VITE_API_URL as string).host;
  const protocol = new URL(import.meta.env.VITE_API_URL as string).protocol;

  useEffect(() => {
    machineApi.setContext({
      ...machineApi.getContext(),
      ...initialContext,
      flowConfig: {
        apiUrl: `${protocol}//${host}`,
        tokenId: getAccessToken(),
      },
    });

    const newState = {
      machineState: machineApi.getState(),
      payload: machineApi.getContext(),
    };
    contextRef.current = newState;

    _setContext(newState);
  }, []);

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
      helpers.setLoading(true);
      try {
        await machineApi.sendEvent(eventName);

        if (!isEqual(machineApi.getContext(), contextRef.current)) {
          _setContext({
            machineState: machineApi.getState(),
            payload: machineApi.getContext(),
          });
        }

        _setContext(prev => ({ ...prev, machineState: machineApi.getState() }));
      } catch (error) {
        console.log(`Error occured on attempt to send event ${eventName}`, error.message);
      } finally {
        helpers.setLoading(false);
      }
    },
    [machineApi, contextRef, helpers],
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
