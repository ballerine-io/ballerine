import { IFormElement } from '@/common/ui-definition-parse-utils/types';

// Looking for documentfield definitions outside of entityfieldgroup
export const findBusinessDocumentDefinitionByTypeAndCategory = (
  elements: Array<IFormElement<any>>,
  {
    type,
    category,
  }: {
    type: string;
    category: string;
  },
) => {
  let businessDocumentDefinition: IFormElement<any> | null = null;

  const findBusinessDocumentDefinitionRecursively = (
    elements: Array<IFormElement<any>>,
    {
      type,
      category,
    }: {
      type: string;
      category: string;
    },
  ) => {
    for (const element of elements) {
      if (element.element === 'entityfieldgroup') {
        continue;
      }

      if (
        element.element === 'documentfield' &&
        element.params?.template?.type === type &&
        element.params?.template?.category === category
      ) {
        businessDocumentDefinition = element;
        continue;
      }

      if (businessDocumentDefinition) {
        return businessDocumentDefinition;
      }

      if (element.children) {
        businessDocumentDefinition = findBusinessDocumentDefinitionRecursively(element.children, {
          type,
          category,
        });
      }
    }

    return businessDocumentDefinition;
  };

  return findBusinessDocumentDefinitionRecursively(elements, { type, category });
};
