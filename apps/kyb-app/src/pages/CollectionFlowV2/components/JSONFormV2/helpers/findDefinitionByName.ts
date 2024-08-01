import { deserializeDocumentId } from '@/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/serialize-document-id';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const findDefinitionByName = (
  name: string,
  elements: UIElement<AnyObject>[],
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
  elements: UIElement<AnyObject>[],
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
  elements: UIElement<AnyObject>[],
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

export const getAllDefinitions = (elements: UIElement<AnyObject>[]) => {
  const items: UIElement<AnyObject>[] = [];

  const run = (elements: UIElement<AnyObject>[]) => {
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
