import { IDocumentRecord, UIPage, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  formatValueDestination,
  getDocumentObjectFromDocumentsList,
  getFieldDefinitionsFromSchema,
  getFileOrFileIdFromDocumentsList,
  IFormElement,
  isDocumentFieldDefinition,
  TBaseFields,
  TDeepthLevelStack,
} from '@ballerine/ui';
import get from 'lodash/get';

export const mapDocumentRecordsToContextDocuments = (
  context: CollectionFlowContext,
  uiSchema: UISchema,
  createdDocuments: IDocumentRecord[],
) => {
  const documentsMap = createdDocuments.reduce((acc, document) => {
    acc[document.id] = document;

    return acc;
  }, {} as Record<string, IDocumentRecord>);

  const run = (elements: Array<IFormElement<TBaseFields, any>>, stack: TDeepthLevelStack = []) => {
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

        document._document = documentRecord;
      }

      if (Array.isArray(element.children) && element.children.length > 0) {
        const value = get(context, formatValueDestination(element.valueDestination, stack));

        if (!value) {
          continue;
        }

        value?.forEach((_: unknown, index: number) => {
          run(element.children as Array<IFormElement<any, any>>, [...stack, index]);
        });
      }
    }
  };

  (uiSchema.uiSchema.elements as unknown as Array<UIPage<'v2'>>).forEach(
    (element: UIPage<'v2'>) => {
      run(getFieldDefinitionsFromSchema(element.elements) as Array<IFormElement<TBaseFields, any>>);
    },
  );

  return context;
};
