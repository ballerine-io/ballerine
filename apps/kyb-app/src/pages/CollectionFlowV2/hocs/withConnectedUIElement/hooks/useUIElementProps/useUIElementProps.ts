import { UIElementV2 } from '@/components/providers/Validator/types';
import { useOnClickHandler } from '@/pages/CollectionFlowV2/hocs/withConnectedUIElement/hooks/useUIElementProps/hooks/useOnClickHandler';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { AnyObject } from '@ballerine/ui';

export const useUIElementProps = (definition: UIElementV2, context: AnyObject, stack: number[]) => {
  const uiElement = useUIElement(definition, context, stack);

  return {
    onClick: useOnClickHandler(uiElement),
  };
};
