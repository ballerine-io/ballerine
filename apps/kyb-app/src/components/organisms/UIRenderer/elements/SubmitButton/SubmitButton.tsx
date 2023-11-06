import { usePageContext } from '@app/components/organisms/DynamicUI/Page';
import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { getElementNames } from '@app/components/organisms/UIRenderer/elements/SubmitButton/helpers';
import { useUIElementHandlers } from '@app/components/organisms/UIRenderer/hooks/useUIElementHandlers';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';
import { UIPage } from '@app/domains/collection-flow';
import { Button } from '@ballerine/ui';
import { useCallback } from 'react';

export const SubmitButton: UIElementComponent<{ text: string }> = ({ definition }) => {
  const { helpers } = useDynamicUIContext();
  const { onClickHandler } = useUIElementHandlers(definition);
  const { state } = useDynamicUIContext();
  const { currentPage } = usePageResolverContext();

  const setPageElementsTouched = useCallback(
    (page: UIPage, state: UIState) => {
      const pageElementNames = getElementNames(page);

      const nextState: UIState = {
        ...state,
        elements: {
          ...state.elements,
        },
      };

      pageElementNames.forEach(elementName => {
        nextState.elements[elementName] = {
          ...nextState.elements[elementName],
          isTouched: true,
        };
      });

      helpers.overrideState(nextState);
    },
    [helpers],
  );

  const handleClick = useCallback(() => {
    setPageElementsTouched(currentPage, state);
    onClickHandler();
  }, [currentPage, state, setPageElementsTouched, onClickHandler]);

  return (
    <Button variant="secondary" onClick={handleClick} disabled={state.isLoading}>
      {definition.options.text || 'Submit'}
    </Button>
  );
};
