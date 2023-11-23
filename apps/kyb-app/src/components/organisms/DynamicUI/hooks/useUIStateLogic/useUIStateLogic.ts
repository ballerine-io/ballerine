import { useUIElementsStateLogic } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic';
import { UIStateSetter } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { useCallback, useMemo, useState } from 'react';

export const useUIStateLogic = (initialState?: UIState) => {
  const [isLoading, setLoading] = useState(false);
  const {
    uiElementsState,
    setState,
    overrideState: overrideUIElementsState,
  } = useUIElementsStateLogic(initialState?.elements);

  const uiState: UIState = useMemo(() => {
    const state: UIState = {
      elements: uiElementsState,
      isLoading,
    };

    return state;
  }, [uiElementsState, isLoading]);

  const overrideUIState: UIStateSetter = useCallback(
    (newState: UIState) => {
      overrideUIElementsState(newState.elements);
      setLoading(newState.isLoading);
    },
    [overrideUIElementsState],
  );

  return {
    uiState,
    setUIElementState: setState,
    setLoading,
    overrideUIState,
  };
};
