import { useUIElementsStateLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { useMemo, useState } from 'react';

export const useUIStateLogic = (initialState?: UIState) => {
  const [isLoading, setLoading] = useState(false);
  const { uiElementsState, setState } = useUIElementsStateLogic(initialState?.elements);

  const uiState: UIState = useMemo(() => {
    const state: UIState = {
      elements: uiElementsState,
      isLoading,
    };

    return state;
  }, [uiElementsState, isLoading]);

  return {
    uiState,
    setUIElementState: setState,
    setLoading,
  };
};
