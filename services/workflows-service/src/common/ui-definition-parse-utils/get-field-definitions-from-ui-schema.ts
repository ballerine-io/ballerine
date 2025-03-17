import { IFormElement } from './types';

export const getFieldDefinitionsFromSchema = (
  elements: Array<IFormElement<any>>,
  definition: Array<IFormElement<any>> = [],
): Array<IFormElement<any>> => {
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
