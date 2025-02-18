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

export const assignDocumentStatusesToDocumentsInContext = (
  context: CollectionFlowContext,
  uiSchema: UISchema,
  documents: IDocumentRecord[],
) => {
  const documentsMap = documents.reduce((acc, document) => {
    acc[document.id] = document;

    return acc;
  }, {} as Record<string, IDocumentRecord>);

  console.log('documentsMap', documentsMap);

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

        const documentFileId = fileOrFileId as string;

        document.status = documentsMap?.[documentFileId]?.status;
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
