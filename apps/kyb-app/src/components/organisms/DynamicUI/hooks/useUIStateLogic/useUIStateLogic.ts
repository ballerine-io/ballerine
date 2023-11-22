import { useUIElementsStateLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic';
import { UIStateSetter } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
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
      ...initialState,
      elements: uiElementsState,
      isLoading,
    };

    return state;
  }, [uiElementsState, isLoading, initialState]);

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
