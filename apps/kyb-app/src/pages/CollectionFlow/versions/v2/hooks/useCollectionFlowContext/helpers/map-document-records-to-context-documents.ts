import { IDocumentRecord, UIPage, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  formatValueDestination,
  getDocumentObjectFromDocumentsList,
  getFieldDefinitionsFromSchema,
  getFileOrFileIdFromDocumentsList,
  IDocumentFieldParams,
  IDocumentTemplate,
  IFormElement,
  isDocumentFieldDefinition,
  removeDocumentFromListByTemplateId,
  TBaseFields,
  TDeepthLevelStack,
} from '@ballerine/ui';
import get from 'lodash/get';
import set from 'lodash/set';
import { findDocumentDefinitionByTypeAndCategory } from '../../../components/organisms/CollectionFlowUI/helpers/find-document-definition-by-type-and-category';

const getEntityTypeFromElementDefinition = (
  definition: IFormElement<'documentfield', IDocumentFieldParams>,
): 'business' | 'ubo' | 'director' => {
  const { valueDestination } = definition;

  if (valueDestination.includes('entity.data.additionalInfo.ubos')) {
    return 'ubo';
  }

  if (valueDestination.includes('entity.data.additionalInfo.directors')) {
    return 'director';
  }

  if (valueDestination === 'documents') return 'business';

  throw new Error('Invalid value destination');
};

const isParentDocumentTypeAndCategoryDifferentFromRecord = (
  parentDocument: IDocumentTemplate,
  record: IDocumentRecord,
) => {
  if (record?.type !== parentDocument.type || record?.category !== parentDocument.category)
    return true;

  return false;
};

const overrideDocumentWithUpdatedDocumentRecord = ({
  document,
  record,
  definition,
}: {
  document: IDocumentTemplate;
  record: IDocumentRecord;
  definition: IFormElement<'documentfield', IDocumentFieldParams>;
}): IDocumentTemplate => {
  const newDocument = structuredClone(document);

  if (!definition?.params?.template?.id) {
    throw new Error('Document field definition must have a template id');
  }

  newDocument.id = definition.params?.template?.id as string;
  newDocument.type = record.type;
  newDocument.category = record.category;
  newDocument._document = record;

  return newDocument;
};

export const mapDocumentRecordsToContextDocuments = (
  _context: CollectionFlowContext,
  uiSchema: UISchema,
  createdDocuments: IDocumentRecord[],
) => {
  const context = structuredClone(_context);

  const documentsMap = createdDocuments.reduce((acc, document) => {
    acc[document.id] = document;

    return acc;
  }, {} as Record<string, IDocumentRecord>);

  const run = (
    elements: Array<IFormElement<TBaseFields, any>>,
    pageElements: Array<IFormElement<any, any>>,
    stack: TDeepthLevelStack = [],
  ) => {
    for (const element of elements) {
      if (isDocumentFieldDefinition(element)) {
        const documents = get(context, formatValueDestination(element.valueDestination, stack));

        const document = getDocumentObjectFromDocumentsList(documents || [], element);

        if (!document) {
          continue;
        }

        const fileOrFileId = getFileOrFileIdFromDocumentsList(documents || [], element);

        if (fileOrFileId instanceof File) {
          continue;
        }

        // Explanation of document handling:
        //
        // Context:
        // When a user uploads a document using the input, the document ID is saved at the document value destination.
        // This approach allows us to indicate that a file exists and was successfully uploaded.
        //
        // Problem:
        // When a document is requested from the Backoffice, we create an empty document, but we cannot assign its ID
        // to the document destination because it would incorrectly appear as if the document already exists.
        //
        // Solution:
        // On document request, we store the document record ID in _document.id.
        // When the user attempts to upload this document, we use _document.id to update the existing document
        // rather than creating a new one.

        const documentRecord = documentsMap?.[document._document.id!];

        if (!documentRecord) {
          throw new Error('Failed to map document record to context document');
        }

        if (isParentDocumentTypeAndCategoryDifferentFromRecord(document, documentRecord)) {
          const newDocuments = removeDocumentFromListByTemplateId(documents, document.id);
          const entityType = getEntityTypeFromElementDefinition(element);
          const newDocumentDefinition = findDocumentDefinitionByTypeAndCategory({
            elements: pageElements,
            entityType,
            type: documentRecord.type,
            category: documentRecord.category,
          });

          if (!newDocumentDefinition) {
            throw new Error('Document definition not found');
          }

          if (!documentRecord) {
            throw new Error('Failed to map document record to context document');
          }

          // Updating category & type on document for cases when _document type or category were updated in backoffice
          const newDocument = overrideDocumentWithUpdatedDocumentRecord({
            document,
            record: documentRecord,
            definition: newDocumentDefinition,
          });

          newDocument._document = documentRecord;

          newDocuments.push(newDocument);

          set(context, formatValueDestination(element.valueDestination, stack), newDocuments);
        } else {
          const documentRecord = documentsMap?.[document._document.id!];

          document._document = documentRecord;
        }
      }

      if (Array.isArray(element.children) && element.children.length > 0) {
        const value = get(context, formatValueDestination(element.valueDestination, stack));

        if (!value) {
          continue;
        }

        value?.forEach((_: unknown, index: number) => {
          run(element.children as Array<IFormElement<any, any>>, pageElements, [...stack, index]);
        });
      }
    }
  };

  (uiSchema.uiSchema.elements as unknown as Array<UIPage<'v2'>>).forEach(
    (element: UIPage<'v2'>) => {
      const pageDefinitions = getFieldDefinitionsFromSchema(element.elements) as Array<
        IFormElement<TBaseFields, any>
      >;

      run(pageDefinitions, pageDefinitions);
    },
  );

  return context;
};
