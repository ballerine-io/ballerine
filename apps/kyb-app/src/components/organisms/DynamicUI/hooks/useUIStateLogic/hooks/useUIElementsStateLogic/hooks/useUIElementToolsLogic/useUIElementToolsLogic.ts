import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useRefValue } from '@/hooks/useRefValue';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export const useUIElementToolsLogic = (elementId: string) => {
  const { helpers, state } = useDynamicUIContext();
  const { setUIElementState } = helpers;
  const { payload, stateApi } = useStateManagerContext();
  const payloadRef = useRefValue(payload);

  const elementsStateRef = useRef(state.elements);

  useEffect(() => {
    elementsStateRef.current = state.elements;
  }, [state.elements]);

  const toggleElementLoading = useCallback(() => {
    const prevState = elementsStateRef.current[elementId];

    setUIElementState(elementId, { ...prevState, isLoading: !prevState?.isLoading });
  }, [elementsStateRef, elementId, setUIElementState]);

  const setElementCompleted = useCallback(
    (elementId: string, completed: boolean) => {
      const prevState = elementsStateRef.current[elementId];

      setUIElementState(elementId, { ...prevState, isCompleted: completed });
    },
    [elementsStateRef, payloadRef, stateApi, setUIElementState],
  );

  const elementState = useMemo(
    () => state.elements[elementId] || null,
    [state.elements, elementId],
  );

  return {
    state: elementState,
    setElementCompleted,
    toggleElementLoading,
  };
};
