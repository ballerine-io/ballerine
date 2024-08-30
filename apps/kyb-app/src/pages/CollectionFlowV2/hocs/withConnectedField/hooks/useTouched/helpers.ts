import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { AnyObject } from '@ballerine/ui';

type TouchedState = Record<string, boolean>;

export const getTouchedStateForElements = (elements: UIElementV2[], context: AnyObject) => {
  const state: TouchedState = {};

  const traverseElements = (elements: UIElementV2[], stack: number[] = []) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const uiElement = new UIElement(element!, context, stack);
      if (element?.type === 'field') {
        state[uiElement.getId()] = true;
        continue;
      }

      if (element?.type === 'field-list') {
        state[uiElement.getId()] = true;

        const value = uiElement.getValue();

        if (!Array.isArray(value)) continue;

        value.forEach((_, index) => {
          traverseElements(element.children!, [...stack, index]);
        });
        continue;
      }

      if (element!.children) {
        traverseElements(element!.children, stack);
      }
    }
  };

  traverseElements(elements);

  return state;
};

export const buildUIStateWithTouchedElements = (touchedState: TouchedState, uiState: UIState) => {
  return Object.keys(touchedState).reduce((state, key) => {
    const isTouched = touchedState[key];

    return {
      ...uiState,
      elements: {
        ...state?.elements,
        [key]: {
          ...state?.elements?.[key],
          isTouched,
        },
      },
    };
  }, {} as UIState);
};
