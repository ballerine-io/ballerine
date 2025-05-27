import { IDocumentFieldParams, IFormElement } from '@ballerine/ui';

export const findEntityDocumentDefinitionByTypeAndCategory = ({
  elements,
  entityType,
  type,
  category,
}: {
  elements: Array<IFormElement<any, any>>;
  entityType: 'ubo' | 'director';
  type: string;
  category: string;
}): IFormElement<'documentfield', IDocumentFieldParams> | undefined => {
  let result: IFormElement<'documentfield', IDocumentFieldParams> | undefined = undefined;

  const findEntityDocumentsRecursively = (elements: Array<IFormElement<any, any>>) => {
    for (const element of elements) {
      if (element.element === 'entityfieldgroup' && element.params?.type === entityType) {
        const entityDocumentDefinition = (element.children as Array<IFormElement<any, any>>)?.find(
          child =>
            child.element === 'documentfield' &&
            child.params?.template?.type === type &&
            child.params?.template?.category === category,
        );

        if (entityDocumentDefinition) {
          result = entityDocumentDefinition;
          return;
        }
      }

      if (element?.children) {
        findEntityDocumentsRecursively(element.children as Array<IFormElement<any, any>>);
      }
    }
  };

  findEntityDocumentsRecursively(elements);

  return result;
};
