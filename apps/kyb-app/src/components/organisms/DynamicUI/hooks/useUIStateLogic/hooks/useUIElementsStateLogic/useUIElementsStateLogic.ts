import {
  UIElementState,
  UIElementStateSetter,
  UIElementsState,
  UIElementsStateSetter,
} from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { useCallback, useState } from 'react';

export const useUIElementsStateLogic = (initialState?: UIState['elements']) => {
  const [uiElementsState, setUIElementsState] = useState<UIElementsState>(initialState || {});

  const setState: UIElementStateSetter = useCallback((elementId: string, state: UIElementState) => {
    setUIElementsState(prev => ({ ...prev, [elementId]: { ...prev[elementId], ...state } }));
  }, []);

  const overrideState: UIElementsStateSetter = useCallback((state: UIElementsState) => {
    setUIElementsState(state);
  }, []);

  return {
    uiElementsState,
    setState,
    overrideState,
  };
};
