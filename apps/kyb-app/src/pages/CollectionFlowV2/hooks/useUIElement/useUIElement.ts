import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIElementDefinition } from '@/domains/collection-flow';
import { transformV1UIElementToV2UIElement } from '@/pages/CollectionFlowV2/helpers';
import { useMemo } from 'react';

export const useUIElement = (definition: UIElementDefinition, context: any, stack?: number[]) => {
  const uiElement = useMemo(
    () => new UIElement(transformV1UIElementToV2UIElement(definition), context, stack || []),
    [definition, context, stack],
  );

  return uiElement;
};
