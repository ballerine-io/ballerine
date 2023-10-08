import { useUIElementsStateLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { useMemo } from 'react';

export const useUIStateLogic = () => {
  const { uiElementsState, setState } = useUIElementsStateLogic();

  const uiState: UIState = useMemo(() => {
    const state: UIState = {
      elements: uiElementsState,
      isLoading: false,
    };

    return state;
  }, [uiElementsState]);

  return {
    uiState,
    setUIElementState: setState,
  };
};
