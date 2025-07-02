import { StateProvider } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useMachineLogic } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { useStateLogic } from '@/components/organisms/DynamicUI/StateManager/hooks/useStateLogic';
import { createStateMachine } from '@/components/organisms/DynamicUI/StateManager/state-machine.factory';
import {
  StateManagerContext,
  StateManagerProps,
} from '@/components/organisms/DynamicUI/StateManager/types';
import { WorkflowBrowserSDK } from '@ballerine/workflow-browser-sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const initializeStateMachine = ({
  workflowId,
  definition,
  definitionType,
  extensions,
  additionalContext,
  initialContext,
  initialState,
}: Omit<StateManagerProps, 'children'> & { initialState: string }) => {
  const initialMachineState = {
    ...initialContext,
    state: initialState,
  };

  const machine = createStateMachine(
    workflowId,
    definition,
    definitionType,
    extensions,
    initialMachineState,
    additionalContext,
  );

  machine.overrideContext(initialMachineState);

  return machine;
};

export const StateManager = ({
  definition,
  extensions,
  definitionType,
  children,
  workflowId,
  initialContext,
  config,
  additionalContext,
}: StateManagerProps) => {
  const [stateMachine, setStateMachine] = useState<WorkflowBrowserSDK>(() =>
    initializeStateMachine({
      workflowId,
      definition,
      definitionType,
      extensions,
      additionalContext,
      initialContext,
      initialState: initialContext?.collectionFlow?.state?.currentStep!,
    }),
  );

  const prevAdditionalContextRef = useRef(additionalContext);

  useEffect(() => {
    if (prevAdditionalContextRef.current !== additionalContext) {
      setStateMachine(prev =>
        initializeStateMachine({
          workflowId,
          definition,
          definitionType,
          extensions,
          additionalContext,
          initialContext: prev.getSnapshot().context,
          initialState: prev.getSnapshot().value,
        }),
      );

      prevAdditionalContextRef.current = additionalContext;
    }
  }, [
    prevAdditionalContextRef,
    additionalContext,
    workflowId,
    definition,
    definitionType,
    extensions,
  ]);

  const reinitializeStateMachineWithNewState = useCallback(
    (newState: string) => {
      setStateMachine(prev => {
        const prevContext = prev.getSnapshot().context;

        return initializeStateMachine({
          workflowId,
          definition,
          definitionType,
          extensions,
          additionalContext,
          initialContext: prevContext,
          initialState: newState,
        });
      });
    },
    [
      additionalContext,
      stateMachine,
      workflowId,
      definition,
      definitionType,
      extensions,
      initialContext,
    ],
  );

  const { machineApi } = useMachineLogic(stateMachine, additionalContext);
  const {
    contextPayload,
    isPluginLoading,
    state,
    sendEvent,
    invokePlugin,
    setContext,
    getContext,
    getState,
  } = useStateLogic(
    machineApi,
    // @ts-ignore
    initialContext,
  );
  const context: StateManagerContext = useMemo(() => {
    const ctx: StateManagerContext = {
      stateApi: {
        sendEvent,
        invokePlugin,
        setContext,
        getContext,
        getState,
        setCollectionFlowState: reinitializeStateMachineWithNewState,
      },
      state,
      payload: contextPayload,
      config,
      isPluginLoading: isPluginLoading,
    };

    return ctx;
  }, [
    state,
    contextPayload,
    isPluginLoading,
    config,
    getState,
    sendEvent,
    invokePlugin,
    setContext,
    getContext,
    reinitializeStateMachineWithNewState,
  ]);

  const child = useMemo(
    () => (typeof children === 'function' ? children(context) : children),
    [children, context],
  );

  return <StateProvider context={context}>{child}</StateProvider>;
};
