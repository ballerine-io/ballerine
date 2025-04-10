import { IFormElement } from '@/common/ui-definition-parse-utils/types';

// Looking for entityfieldgroup definitions
export const findEntityFieldsDefinition = (
  elements: Array<IFormElement<any>>,
  entityType: 'ubo' | 'director' | 'business',
): IFormElement<any> | null => {
  let entityFieldsDefinition: IFormElement<any> | null = null;

  const findDefinitionRecursively = (
    elements: Array<IFormElement<any>>,
    entityType: 'ubo' | 'director' | 'business',
  ): IFormElement<any> | null => {
    for (const element of elements) {
      if (element.element === 'entityfieldgroup' && element.params?.type === entityType) {
        entityFieldsDefinition = element;
        break;
      }

      if (element.children) {
        entityFieldsDefinition = findDefinitionRecursively(
          element.children as Array<IFormElement<any>>,
          entityType,
        );
      }
    }

    return entityFieldsDefinition;
  };

  return findDefinitionRecursively(elements, entityType);
};
