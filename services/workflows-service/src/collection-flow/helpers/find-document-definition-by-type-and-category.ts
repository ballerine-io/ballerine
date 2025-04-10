import { IFormElement } from '@/common/ui-definition-parse-utils/types';

export const findDocumentDefinitionByTypeAndCategory = (
  elements: Array<IFormElement<any>>,
  { type, category }: { type: string; category: string },
) => {
  let documentDefinition: IFormElement<any> | null = null;

  const findDocumentDefinitionRecursively = (
    elements: Array<IFormElement<any>>,
  ): IFormElement<any> | null => {
    for (const element of elements) {
      if (
        element.element === 'documentfield' &&
        element.params?.template?.type === type &&
        element.params?.template?.category === category
      ) {
        documentDefinition = element;
        break;
      }

      if (element.children) {
        documentDefinition = findDocumentDefinitionRecursively(element.children);
      }
    }

    return documentDefinition;
  };

  return findDocumentDefinitionRecursively(elements);
};
