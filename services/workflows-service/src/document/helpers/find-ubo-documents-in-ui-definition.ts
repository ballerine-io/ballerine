import { formatValueDestination } from '@/common/ui-definition-parse-utils/format-value-destination';
import {
  IDocumentTemplate,
  IFormElement,
  IUIDefinitionPage,
  TDeepthLevelStack,
} from '@/common/ui-definition-parse-utils/types';
import { AnyRecord } from '@ballerine/common';
import { UiDefinition } from '@prisma/client';
import get from 'lodash/get';

export const findUboDocumentsInUIDefinition = (
  context: AnyRecord,
  uiDefinition: UiDefinition,
): Array<IDocumentTemplate & { ballerineEntityId?: string }> => {
  const documents: Array<IDocumentTemplate & { ballerineEntityId?: string }> = [];
  const pages = (uiDefinition.uiSchema as unknown as { elements: IUIDefinitionPage[] }).elements;

  const findUboDocumentsRecursively = (
    elements: Array<IFormElement<{ template: IDocumentTemplate }>>,
    parent: IFormElement<any> | null,
    stack: TDeepthLevelStack = [],
  ) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as IFormElement<any>;

      if (element.element === 'entityfieldgroup' && element.params.type === 'ubo') {
        const entitiesPath = formatValueDestination(element.valueDestination, stack);
        const entities = get(context, entitiesPath, []) as Array<{ ballerineEntityId: string }>;

        const entityDocumentsDefinitions = element.children?.filter(
          child => child.element === 'documentfield',
        );

        entities.forEach((entity: { ballerineEntityId: string }) => {
          const entityDocumentsPaths = entityDocumentsDefinitions?.map(definition =>
            formatValueDestination(definition.valueDestination, [...stack, i]),
          );

          entityDocumentsPaths?.forEach(path => {
            const entityDocuments = get(context, path, []) as IDocumentTemplate[];

            entityDocuments.forEach(
              (document: IDocumentTemplate & { ballerineEntityId?: string }) => {
                document.ballerineEntityId = entity.ballerineEntityId;

                documents.push(document);
              },
            );
          });
        });
      }

      if (element?.children) {
        findUboDocumentsRecursively(
          element.children as Array<IFormElement<{ template: IDocumentTemplate }>>,
          element || null,
          [...stack, i],
        );
      }
    }
  };

  pages.forEach(page => {
    findUboDocumentsRecursively(
      page.elements as Array<IFormElement<{ template: IDocumentTemplate }>>,
      null,
    );
  });

  return documents;
};
