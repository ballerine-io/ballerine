import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIPage } from '@/domains/collection-flow';
import { transformV1UIElementsToV2UIElements } from '@/pages/CollectionFlowV2/helpers';
import {
  buildUIStateWithTouchedElements,
  getTouchedStateForElements,
} from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useTouched/helpers';
import { useCallback, useMemo } from 'react';

export const useTouched = (uiElement: UIElement, currentPage?: UIPage) => {
  const { state, helpers } = useDynamicUIContext();
  const { payload } = useStateManagerContext();

  const uiElements = useMemo(() => {
    if (!currentPage) return [];

    return transformV1UIElementsToV2UIElements(currentPage.elements);
  }, [currentPage]);

  const touchElement = useCallback(() => {
    helpers.setUIElementState(uiElement.getId(), { isTouched: true });
  }, [uiElement]);

  const touchPageElements = useCallback(() => {
    if (!currentPage) {
      console.warn('currentPage not provided.');
      return;
    }

    const touchedElementsMap = getTouchedStateForElements(uiElements, payload);
    const newState = buildUIStateWithTouchedElements(touchedElementsMap, state);

    helpers.overrideState(newState);
  }, [state, uiElements, payload]);

  const isTouched = useMemo(
    () => Boolean(state.elements[uiElement.getId()]?.isTouched),
    [state.elements, uiElement],
  );

  return {
    isTouched,
    touchElement,
    touchPageElements,
  };
};
