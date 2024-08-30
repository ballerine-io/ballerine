import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';

export const useIsLoadingState = (uiElement: UIElement) => {
  const { state } = useDynamicUIContext();

  return Boolean(state.elements[uiElement.getId()]?.isLoading);
};
