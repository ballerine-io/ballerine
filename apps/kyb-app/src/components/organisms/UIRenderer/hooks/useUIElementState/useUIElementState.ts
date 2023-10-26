import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { UIElementState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { UIElement } from '@app/domains/collection-flow';
import { useMemo } from 'react';

export const useUIElementState = (definition: UIElement) => {
  const { state, helpers } = useDynamicUIContext();

  const elementState: UIElementState = useMemo(() => {
    return (
      state.elements[definition.name] || {
        isLoading: false,
        isCompleted: false,
        isTouched: false,
      }
    );
  }, [definition.name, state.elements]);

  return {
    state: elementState,
    setState: helpers.setUIElementState,
  };
};
