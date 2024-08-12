import { UIElementV2 } from '@/components/providers/Validator/types';
import { UIElementDefinition } from '@/domains/collection-flow';

const resolveElementType = (element: UIElementDefinition): UIElementV2['type'] => {
  if (element.options?.jsonFormDefinition?.type === 'array') {
    return 'field-list';
  }

  if (element.validation) return 'field';

  return 'ui';
};

export const transformV1UIElementToV2UIElement = (element: UIElementDefinition): UIElementV2 => {
  return {
    id: element.name,
    valueDestination: element.valueDestination,
    validation: element.validation,
    type: resolveElementType(element),
    children: element.elements ? transformV1UIElementsToV2UIElements(element.elements) : [],
  } as UIElementV2;
};

export const transformV1UIElementsToV2UIElements = (
  elements: UIElementDefinition[],
): UIElementV2[] => {
  return elements.map(transformV1UIElementToV2UIElement);
};
