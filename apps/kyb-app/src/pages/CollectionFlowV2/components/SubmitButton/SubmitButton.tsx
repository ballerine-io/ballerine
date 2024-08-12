import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useUIElementHandlers } from '@/components/organisms/UIRenderer/hooks/useUIElementHandlers';
import { useUIElementState } from '@/components/organisms/UIRenderer/hooks/useUIElementState';
import { UIElementComponent } from '@/components/organisms/UIRenderer/types';
import { useValidator } from '@/components/providers/Validator/hooks/useValidator';
import { useFlowTracking } from '@/hooks/useFlowTracking';
import { useTouched } from '@/pages/CollectionFlowV2/hooks/useTouched';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { Button } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';

export const SubmitButton: UIElementComponent<{ text: string }> = ({ definition }) => {
  const { helpers } = useDynamicUIContext();
  const { onClickHandler } = useUIElementHandlers(definition);
  const { state } = useDynamicUIContext();
  const { state: uiElementState } = useUIElementState(definition);
  const { currentPage, pages } = usePageResolverContext();
  const { isPluginLoading, payload } = useStateManagerContext();
  const { errors, validate } = useValidator();
  const isValid = useMemo(() => !Object.values(errors).length, [errors]);
  const uiElement = useUIElement(definition, payload);

  const { touchPageElements } = useTouched(uiElement, currentPage!);

  const { trackFinish } = useFlowTracking();

  const handleClick = useCallback(() => {
    touchPageElements();
    validate();
    onClickHandler();

    const isFinishPage = currentPage?.name === pages.at(-1)?.name;

    if (isFinishPage && isValid) {
      trackFinish();
    }
  }, [
    currentPage,
    pages,
    state,
    isValid,
    touchPageElements,
    onClickHandler,
    trackFinish,
    validate,
  ]);

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={state.isLoading || uiElementState.isLoading || isPluginLoading}
      data-testid={definition.name}
    >
      {definition.options.text || 'Submit'}
    </Button>
  );
};
