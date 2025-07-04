import { TUIElement } from '@ballerine/common';

export const getFieldDefinitionsFromSchema = (
  elements: Array<TUIElement>,
  definition: Array<TUIElement> = [],
): Array<TUIElement> => {
  const filteredElements = elements.filter(
    element => element.valueDestination || element.children?.length,
  );

  for (let i = 0; i < filteredElements.length; i++) {
    const element = filteredElements[i]!;

    if (element.valueDestination) {
      definition.push(element);

      if (element.children?.length) {
        element.children = getFieldDefinitionsFromSchema(element.children || []);
      }
    } else {
      getFieldDefinitionsFromSchema(element.children || [], definition);
    }
  }

  return definition;
};
