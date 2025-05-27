import { IDocumentFieldParams, IFormElement } from '@ballerine/ui';
import { findEntityDocumentDefinitionByTypeAndCategory } from './find-entity-document-definition-by-type-and-category';

export const findDocumentDefinitionByTypeAndCategory = ({
  type,
  category,
  elements,
  entityType,
}: {
  type: string;
  category: string;
  elements: Array<IFormElement<any, any>>;
  entityType?: 'business' | 'ubo' | 'director';
}): IFormElement<'documentfield', IDocumentFieldParams> | undefined => {
  const findDocumentsRecursively = (
    elements: Array<IFormElement<'documentfield', IDocumentFieldParams>>,
  ) => {
    for (const element of elements) {
      if (
        element.element === 'documentfield' &&
        element?.params?.template?.type === type &&
        element?.params?.template?.category === category
      ) {
        return element;
      }

      if (element?.children) {
        findDocumentsRecursively(element.children as Array<IFormElement<any, any>>);
      }
    }
  };

  return entityType === 'business'
    ? findDocumentsRecursively(elements)
    : findEntityDocumentDefinitionByTypeAndCategory({
        elements,
        entityType: entityType as 'ubo' | 'director',
        type,
        category,
      });
};
