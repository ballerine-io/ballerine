import { deserializeDocumentId } from '@/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField/helpers/serialize-document-id';
import { UIElementDefinition } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const findDefinitionByName = (
  name: string,
  elements: UIElementDefinition<AnyObject>[],
): UIElementDefinition<AnyObject> | undefined => {
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
  elements: UIElementDefinition<AnyObject>[],
): UIElementDefinition<AnyObject> | undefined => {
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
  elements: UIElementDefinition<AnyObject>[],
): UIElementDefinition<AnyObject> | undefined => {
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

export const getAllDefinitions = (elements: UIElementDefinition<AnyObject>[]) => {
  const items: UIElementDefinition<AnyObject>[] = [];

  const run = (elements: UIElementDefinition<AnyObject>[]) => {
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
