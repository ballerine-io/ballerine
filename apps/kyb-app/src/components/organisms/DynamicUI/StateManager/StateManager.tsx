import { StateProvider } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useMachineLogic } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { useStateLogic } from '@app/components/organisms/DynamicUI/StateManager/hooks/useStateLogic';
import { createStateMachine } from '@app/components/organisms/DynamicUI/StateManager/state-machine.factory';
import {
  StateManagerContext,
  StateManagerProps,
} from '@app/components/organisms/DynamicUI/StateManager/types';
import { useMemo } from 'react';

export const StateManager = ({
  definition,
  extensions,
  definitionType,
  children,
  workflowId,
  initialContext,
}: StateManagerProps) => {
  const machine = useMemo(() => {
    const initialMachineState = {
      ...initialContext,
      state: initialContext?.flowConfig?.appState,
    };

    const machine = createStateMachine(
      workflowId,
      definition,
      definitionType,
      extensions,
      initialMachineState,
    );

    machine.overrideContext(initialMachineState);
    return machine;
  }, []);

  const { machineApi } = useMachineLogic(machine);
  const { contextPayload, state, sendEvent, invokePlugin, setContext, getContext, getState } =
    useStateLogic(machineApi, initialContext);
  const context: StateManagerContext = useMemo(() => {
    const ctx: StateManagerContext = {
      stateApi: {
        sendEvent,
        invokePlugin,
        setContext,
        getContext,
        getState,
      },
      state,
      payload: contextPayload,
    };
    return ctx;
  }, [state, contextPayload, getState, sendEvent, invokePlugin, setContext, getContext]);

  const child = useMemo(
    () => (typeof children === 'function' ? children(context) : children),
    [children, context],
  );

  if (import.meta.env.MODE === 'development') {
    console.log('Context', contextPayload);
  }

  return <StateProvider context={context}>{child}</StateProvider>;
};
