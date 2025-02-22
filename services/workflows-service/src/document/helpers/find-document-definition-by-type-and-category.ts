import {
  IDocumentTemplate,
  IFormElement,
  IUIDefinitionPage,
} from '@/common/ui-definition-parse-utils/types';
import { UiDefinition } from '@prisma/client';

export const findDocumentDefinitionByTypeAndCategory = (
  type: string,
  category: string,
  uiDefinition: UiDefinition,
): IFormElement<{ template: IDocumentTemplate }> | undefined => {
  let result: IFormElement<{ template: IDocumentTemplate }> | undefined = undefined;
  const pages = (uiDefinition.uiSchema as unknown as { elements: IUIDefinitionPage[] }).elements;

  const run = (elements: Array<IFormElement<{ template: IDocumentTemplate }>>) => {
    for (const element of elements) {
      if (
        element.element === 'documentfield' &&
        element?.params?.template?.type === type &&
        element?.params?.template?.category === category
      ) {
        result = element;
        break;
      }

      if (element?.children) {
        run(element.children as Array<IFormElement<{ template: IDocumentTemplate }>>);
      }
    }
  };

  pages.forEach(page => {
    run(page.elements as Array<IFormElement<{ template: IDocumentTemplate }>>);
  });

  return result;
};
