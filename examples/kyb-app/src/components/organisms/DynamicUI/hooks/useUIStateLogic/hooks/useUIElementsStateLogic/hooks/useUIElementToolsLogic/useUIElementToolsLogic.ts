import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useCallback, useEffect, useRef } from 'react';

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

  return {
    toggleElementLoading,
  };
};
