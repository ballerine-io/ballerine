import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useValidator } from '@/components/providers/Validator/hooks/useValidator';
import { useFlowTracking } from '@/hooks/useFlowTracking';
import { useTouched } from '@/pages/CollectionFlowV2/hocs/withConnectedField';
import { useIsDisabledState } from '@/pages/CollectionFlowV2/hooks/useDisabledState';
import { useIsLoadingState } from '@/pages/CollectionFlowV2/hooks/useIsLoadingState';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { Button, createTestId } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo } from 'react';

export interface ISubmitButtonOptions {
  text: string;
}

export const SubmitButton: FunctionComponent<IUIComponentProps<ISubmitButtonOptions>> = ({
  definition,
  uiElementProps,
  stack,
  options,
}) => {
  const { text } = options;
  const { isPluginLoading, payload } = useStateManagerContext();
  const uiElement = useUIElement(definition, payload);
  const { onClick } = uiElementProps;

  const { state } = useDynamicUIContext();
  const isLoading = useIsLoadingState(uiElement);
  const isDisabled = useIsDisabledState(uiElement, payload);

  const { currentPage, pages } = usePageResolverContext();

  const { errors, validate } = useValidator();
  const isValid = useMemo(() => !Object.values(errors).length, [errors]);

  const { touchPageElements } = useTouched(uiElement, currentPage!);

  const { trackFinish } = useFlowTracking();

  const handleClick = useCallback(() => {
    touchPageElements();
    validate();
    onClick();

    const isFinishPage = currentPage?.name === pages.at(-1)?.name;

    if (isFinishPage && isValid) {
      trackFinish();
    }
  }, [currentPage, pages, state, isValid, touchPageElements, onClick, trackFinish, validate]);

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={state.isLoading || isLoading || isDisabled || isPluginLoading}
      data-testid={createTestId(definition, stack)}
    >
      {text || 'Submit'}
    </Button>
  );
};
