import { AnyObject } from '@ballerine/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useCustomer } from '@/components/providers/CustomerProvider';
import { isErrorWithMessage } from '@ballerine/common';

interface State {
  machineState: string;
  payload: CollectionFlowContext;
}

export const useStateLogic = (machineApi: StateMachineAPI, initialContext = {}) => {
  const [contextPayload, setState] = useState<State>(() => ({
    machineState: machineApi.getState(),
    payload: machineApi.getContext() as CollectionFlowContext,
  }));

  const contextRef = useRef<State>(contextPayload);
  const { helpers } = useDynamicUIContext();
  const host = new URL(import.meta.env.VITE_API_URL as string).host;
  const protocol = new URL(import.meta.env.VITE_API_URL as string).protocol;
  const { customer } = useCustomer();

  useEffect(() => {
    const ctx = machineApi.getContext();

    machineApi.setContext({
      ...ctx,
      ...initialContext,
      flowConfig: {
        ...ctx?.flowConfig,
        apiUrl: `${protocol}//${host}`,
        tokenId: getAccessToken(),
        customerCompany: customer?.displayName,
      } as CollectionFlowContext['flowConfig'],
    } as CollectionFlowContext);

    const newState = {
      machineState: machineApi.getState(),
      payload: machineApi.getContext(),
    };
    contextRef.current = newState;

    setState(newState);
  }, []);

  const setContext = useCallback(
    (newContext: AnyObject) => {
      const newCtx = { ...newContext };
      machineApi.setContext(newCtx);

      setState(prev => {
        const nextState = { ...prev, payload: newCtx };
        contextRef.current = nextState;
        return nextState;
      });

      return newCtx;
    },
    [machineApi, contextRef],
  );

  const invokePlugin = useCallback(
    async (pluginName: string) => {
      await machineApi.invokePlugin(pluginName);

      setState({
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
          setState({
            machineState: machineApi.getState(),
            payload: machineApi.getContext(),
          });
        }

        setState(prev => ({ ...prev, machineState: machineApi.getState() }));
      } catch (error) {
        console.error(
          `Error occured on attempt to send event ${eventName}`,
          isErrorWithMessage(error) ? error.message : error,
        );
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
