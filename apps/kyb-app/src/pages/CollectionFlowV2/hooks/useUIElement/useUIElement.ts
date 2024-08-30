import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { useMemo } from 'react';

export const useUIElement = (definition: UIElementV2, context: any, stack?: number[]) => {
  const uiElement = useMemo(
    () => new UIElement(definition, context, stack || []),
    [definition, context, stack],
  );

  return uiElement;
};
