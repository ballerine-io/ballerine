import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { isErrorWithMessage } from '@ballerine/common';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useRef, useState } from 'react';

interface State {
  machineState: string;
  payload: CollectionFlowContext;
  isPluginLoading: boolean;
}

export const useStateLogic = (machineApi: StateMachineAPI, initialContext = {}) => {
  const [contextPayload, setState] = useState<State>(() => ({
    machineState: machineApi.getState(),
    payload: machineApi.getContext() as CollectionFlowContext,
    isPluginLoading: false,
  }));

  const contextRef = useRef<State>(contextPayload);
  const { helpers } = useDynamicUIContext();

  useEffect(() => {
    const ctx = machineApi.getContext();

    machineApi.setContext({
      ...ctx,
      ...initialContext,
    } as CollectionFlowContext);

    const newState = {
      machineState: machineApi.getState(),
      payload: machineApi.getContext(),
      isPluginLoading: false,
    };
    contextRef.current = newState;

    setState(newState);
  }, []);

  const setContext = useCallback(
    (newContext: CollectionFlowContext) => {
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
      setState(prev => ({ ...prev, isPluginLoading: true }));

      await machineApi.invokePlugin(pluginName);

      setState({
        machineState: machineApi.getState(),
        payload: machineApi.getContext(),
        isPluginLoading: false,
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
          setState(prev => ({
            ...prev,
            machineState: machineApi.getState(),
            payload: machineApi.getContext(),
          }));
        }

        setState(prev => ({ ...prev, machineState: machineApi.getState() }));
      } catch (error) {
        console.error(
          `Error occured on attempt to send event ${eventName}`,
          isErrorWithMessage(error) ? error.message : error,
        );
        throw error;
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
    isPluginLoading: contextPayload.isPluginLoading,
    invokePlugin,
    setContext,
    sendEvent,
    getContext,
    getState,
  };
};
