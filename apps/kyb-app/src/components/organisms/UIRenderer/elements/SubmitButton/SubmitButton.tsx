import { usePageContext } from '@/components/organisms/DynamicUI/Page';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { getElementByValueDestination } from '@/components/organisms/UIRenderer/elements/SubmitButton/helpers';
import { useUIElementHandlers } from '@/components/organisms/UIRenderer/hooks/useUIElementHandlers';
import { useUIElementState } from '@/components/organisms/UIRenderer/hooks/useUIElementState';
import { UIElementComponent } from '@/components/organisms/UIRenderer/types';
import { UIPage } from '@/domains/collection-flow';
import { Button } from '@ballerine/ui';
import { useCallback } from 'react';

export const SubmitButton: UIElementComponent<{ text: string }> = ({ definition }) => {
  const { helpers } = useDynamicUIContext();
  const { onClickHandler } = useUIElementHandlers(definition);
  const { state } = useDynamicUIContext();
  const { state: uiElementState } = useUIElementState(definition);
  const { currentPage } = usePageResolverContext();
  const { errors } = usePageContext();

  const setPageElementsTouched = useCallback(
    (page: UIPage, state: UIState) => {
      const nextState: UIState = {
        ...state,
        elements: {
          ...state.elements,
        },
      };

      Object.keys(errors).forEach(valueDestination => {
        // Loking for element with matching valueDestination
        const element = getElementByValueDestination(valueDestination, page);

        // Checking valueDestination for Array values
        const elementIndex = valueDestination.match(/\[(\d+)\]/)?.[1];

        if (!element) return;

        const elementName = `${element.name}${elementIndex ? `[${elementIndex}]` : ''}`;

        nextState.elements[elementName] = {
          ...nextState.elements[elementName],
          isTouched: true,
        };
      });

      helpers.overrideState(nextState);
    },
    [helpers, errors],
  );

  const handleClick = useCallback(() => {
    setPageElementsTouched(
      // @ts-ignore
      currentPage,
      state,
    );
    onClickHandler();
  }, [currentPage, state, setPageElementsTouched, onClickHandler]);

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={state.isLoading || uiElementState.isLoading}
    >
      {definition.options.text || 'Submit'}
    </Button>
  );
};
