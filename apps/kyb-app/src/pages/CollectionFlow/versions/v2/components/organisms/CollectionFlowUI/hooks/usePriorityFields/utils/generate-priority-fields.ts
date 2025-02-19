import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  formatId,
  formatValueDestination,
  getFieldDefinitionsFromSchema,
  IDocumentTemplate,
  IFormElement,
  IPriorityField,
  isDocumentFieldDefinition,
  TBaseFields,
  TDeepthLevelStack,
} from '@ballerine/ui';
import get from 'lodash/get';

export const generatePriorityFields = (
  elements: Array<IFormElement<any, any>>,
  context: CollectionFlowContext,
): IPriorityField[] | undefined => {
  const fieldElements = getFieldDefinitionsFromSchema(elements);
  const priorityFields: IPriorityField[] = [];

  const run = (elements: Array<IFormElement<TBaseFields, any>>, stack: TDeepthLevelStack = []) => {
    for (const element of elements) {
      // Extracting revision reason fro documents isnt common so we handling it explicitly
      if (isDocumentFieldDefinition(element)) {
        const documents = get(context, formatValueDestination(element.valueDestination, stack));
        const document = documents?.find(
          (doc: IDocumentTemplate) => doc.id === element.params?.template?.id,
        );

        if (!document) {
          continue;
        }

        console.log('document', document);
        const reason =
          document.status === 'requested' ? 'Requested' : document.decision?.revisionReason;

        if (!reason) {
          continue;
        }

        priorityFields.push({
          id: formatId(element.id, stack),
          reason,
        });
      }

      // TODO: Implement extracting priority fields from other elements
      // TODO: Discuss with team where revision reasons will be stored for other elements

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

  run(fieldElements);

  return priorityFields.length ? priorityFields : undefined;
};
