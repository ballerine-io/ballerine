import { ARRAY_VALUE_INDEX_PLACEHOLDER } from '@/common/consts/consts';
import { DocumentFieldParams } from '@/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField';
import { UIElementDefinition, UIPage } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const getElementByValueDestination = (
  destination: string,
  page: UIPage,
): UIElementDefinition<AnyObject> | null => {
  const arrayIndexRegex = /[(\d)]/g;
  const isIndexValue = destination.match(arrayIndexRegex);

  const findByElementDefinitionByDestination = (
    targetDestination: string,
    elements: UIElementDefinition<AnyObject>[],
  ): UIElementDefinition<AnyObject> | null => {
    for (const element of elements) {
      if (element.valueDestination === targetDestination) return element;

      if (element.elements) {
        const foundElement = findByElementDefinitionByDestination(
          targetDestination,
          element.elements,
        );
        if (foundElement) return foundElement;
      }
    }

    return null;
  };

  if (isIndexValue) {
    const originArrayDestinationPath = destination.replace(
      /\[(\d+)\]/,
      `[${ARRAY_VALUE_INDEX_PLACEHOLDER}]`,
    );

    const element = findByElementDefinitionByDestination(originArrayDestinationPath, page.elements);
    return element;
  }

  return findByElementDefinitionByDestination(destination, page.elements);
};

export const getDocumentElementByDocumentError = (
  id: string,
  page: UIPage,
): UIElementDefinition<AnyObject> | null => {
  const findElement = (
    id: string,
    elements: UIElementDefinition<AnyObject>[],
  ): UIElementDefinition<DocumentFieldParams> | null => {
    for (const element of elements) {
      //@ts-ignore
      if (element.options?.documentData?.id === id.replace('document-error-', '')) return element;

      if (element.elements) {
        const foundInElements = findElement(id, element.elements);
        if (foundInElements) return foundInElements;
      }
    }

    return null;
  };

  return findElement(id, page.elements);
};
