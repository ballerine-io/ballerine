import { formatValueDestination } from '@/common/ui-definition-parse-utils/format-value-destination';
import { getFieldDefinitionsFromSchema } from '@/common/ui-definition-parse-utils/get-field-definitions-from-ui-schema';
import {
  IDocumentTemplate,
  IFormElement,
  IUIDefinitionPage,
  TDeepthLevelStack,
} from '@/common/ui-definition-parse-utils/types';
import { AnyRecord } from '@ballerine/common';
import { Document, UiDefinition } from '@prisma/client';
import { set } from 'lodash';
import get from 'lodash/get';
import { parseDocumentDefinition } from './parse-document-definition';

export const addRequestedDocumentToIndividualDocuments = (
  context: AnyRecord,
  entityType: 'ubo' | 'director' | 'business',
  uiDefinition: UiDefinition,
  createdDocument: {
    id: string;
    type: string;
    category: string;
    issuingCountry: string;
    issuingVersion: string;
    version: string;
    status: Document['status'];
    decision: Document['decision'];
    entityId: string | undefined;
  },
) => {
  if (entityType !== 'ubo' && entityType !== 'director') {
    throw new Error('Requested documents are not supported for UBOs or Directors.');
  }

  const pages = (uiDefinition.uiSchema as unknown as { elements: IUIDefinitionPage[] }).elements;

  const addRequestedDocumentsRecursively = (
    elements: Array<IFormElement<any>>,
    stack: TDeepthLevelStack,
    { entityType }: { entityType?: 'ubo' | 'director'; ballerineEntityId?: string },
  ) => {
    for (const element of elements) {
      // Extracting revision reason fro documents isnt common so we handling it explicitly
      if (element.element === 'documentfield' && stack?.length) {
        const parsedDocument = parseDocumentDefinition(element);

        if (
          createdDocument.type !== parsedDocument?.type ||
          createdDocument.category !== parsedDocument?.category
        ) {
          continue;
        }

        if (!parsedDocument) {
          continue;
        }

        const entityDocuments = get(
          context,
          formatValueDestination(element.valueDestination, stack),
          [],
        ) as IDocumentTemplate[];

        const documentTemplate: IDocumentTemplate = {
          id: parsedDocument.templateId,
          category: createdDocument.category,
          type: createdDocument.type,
          issuer: {
            country: createdDocument.issuingCountry,
          },
          version: Number(createdDocument.version),
          issuingVersion: Number(createdDocument.issuingVersion),
          properties: {} as AnyRecord,
          pages: [],
          status: createdDocument.status,
          decision: createdDocument.decision,
          _document: {
            id: createdDocument.id,
          },
        };

        entityDocuments.push(documentTemplate);
        set(context, formatValueDestination(element.valueDestination, stack), entityDocuments);
      }

      if (element.element === 'entityfieldgroup' && entityType === element.params.type) {
        const value = get(
          context,
          formatValueDestination(element.valueDestination, stack),
          [],
        ) as Array<{ ballerineEntityId: string }>;

        if (!value) {
          continue;
        }

        if (Array.isArray(element.children) && element.children.length > 0) {
          value?.forEach(({ ballerineEntityId }, index: number) => {
            if (ballerineEntityId !== createdDocument.entityId) {
              return;
            }

            addRequestedDocumentsRecursively(
              element.children as Array<IFormElement<any>>,
              [...stack, index],
              {
                entityType,
                ballerineEntityId,
              },
            );
          });
        }
      }
    }
  };

  pages?.forEach(page => {
    addRequestedDocumentsRecursively(
      getFieldDefinitionsFromSchema(page.elements) as Array<
        IFormElement<{ template: IDocumentTemplate }>
      >,
      [],
      { entityType, ballerineEntityId: createdDocument.entityId },
    );
  });

  return context;
};
