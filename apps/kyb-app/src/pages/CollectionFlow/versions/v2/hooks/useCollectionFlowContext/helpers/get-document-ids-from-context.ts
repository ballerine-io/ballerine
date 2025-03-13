import { UIPage, UISchema } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { TDocument } from '@ballerine/common';
import {
  formatValueDestination,
  getFieldDefinitionsFromSchema,
  IFormElement,
  isDocumentFieldDefinition,
  TBaseFields,
  TDeepthLevelStack,
} from '@ballerine/ui';
import get from 'lodash/get';

export const getDocumentIdsFromContext = (context: CollectionFlowContext, uiSchema: UISchema) => {
  const documentIds: string[] = [];

  const run = (elements: Array<IFormElement<TBaseFields, any>>, stack: TDeepthLevelStack = []) => {
    for (const element of elements) {
      if (isDocumentFieldDefinition(element)) {
        const documents = get(context, formatValueDestination(element.valueDestination, stack));
        const document = documents?.find(
          (doc: TDocument) => doc.id === element.params?.template?.id,
        );

        if (!document) {
          continue;
        }

        const documentId = document._document.id;

        if (!documentId || documentId instanceof File) {
          continue;
        }

        documentIds.push(documentId);
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

  return documentIds;
};
