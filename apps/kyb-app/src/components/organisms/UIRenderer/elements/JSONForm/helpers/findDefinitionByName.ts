import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

const deserializeDocumentId = (id: string) => {
  return id;
};

export const findDefinitionByName = (
  name: string,
  elements: Array<UIElement<AnyObject>>,
): UIElement<AnyObject> | undefined => {
  for (const element of elements) {
    if (element.name === name) {
      return element;
    }

    if (element.elements) {
      const foundInChildren = findDefinitionByName(name, element.elements);

      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }

  return;
};

export const findDefinitionByDestinationPath = (
  destination: string,
  elements: Array<UIElement<AnyObject>>,
): UIElement<AnyObject> | undefined => {
  for (const element of elements) {
    if (element.valueDestination === destination) {
      return element;
    }

    if (element.elements) {
      const foundInChildren = findDefinitionByDestinationPath(destination, element.elements);

      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }

  return undefined;
};

export const findDocumentDefinitionById = (
  id: string,
  elements: Array<UIElement<AnyObject>>,
): UIElement<AnyObject> | undefined => {
  for (const element of elements) {
    if ((element?.options?.documentData?.id as string) === deserializeDocumentId(id)) {
      return element;
    }

    if (element.elements) {
      const foundInChildren = findDocumentDefinitionById(id, element.elements);

      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }

  return undefined;
};

export const getAllDefinitions = (elements: Array<UIElement<AnyObject>>) => {
  const items: Array<UIElement<AnyObject>> = [];

  const run = (elements: Array<UIElement<AnyObject>>) => {
    for (const element of elements) {
      if (element.valueDestination) {
        items.push(element);
      }

      if (element.elements) {
        run(element.elements);
      }
    }
  };

  run(elements);

  return items;
};
