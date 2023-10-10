import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export const useUIElementToolsLogic = (elementId: string) => {
  const { helpers, state } = useDynamicUIContext();
  const { setUIElementState } = helpers;

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
    [elementsStateRef, setUIElementState],
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
