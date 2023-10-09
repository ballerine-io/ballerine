import {
  UIElementState,
  UIElementStateSetter,
  UIElementsState,
} from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { useCallback, useState } from 'react';

export const useUIElementsStateLogic = () => {
  const [uiElementsState, setUIElementsState] = useState<UIElementsState>({});

  const setState: UIElementStateSetter = useCallback((elementId: string, state: UIElementState) => {
    setUIElementsState(prev => ({ ...prev, [elementId]: { ...prev[elementId], ...state } }));
  }, []);

  return {
    uiElementsState,
    setState,
  };
};
