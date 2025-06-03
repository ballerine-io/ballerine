import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  formatId,
  formatValueDestination,
  IDocument,
  IFormElement,
  IPriorityField,
  isDocumentFieldDefinition,
  TBaseFields,
  TDeepthLevelStack,
  TDocumentEntityType,
} from '@ballerine/ui';
import { isEntityFieldGroupDefinition } from '@ballerine/ui';
import get from 'lodash/get';

export const generateGranularRevisionFields = ({
  context,
  documents,
  elements,
  stack = [],
  revisionFields = [],
  entityType = 'business',
}: {
  context: CollectionFlowContext;
  documents: IDocument[];
  elements: Array<IFormElement<TBaseFields, any>>;
  stack?: TDeepthLevelStack;
  revisionFields?: IPriorityField[];
  entityType?: TDocumentEntityType;
}) => {
  for (const element of elements) {
    // Extracting revision reason fro documents isnt common so we handling it explicitly

    if (isEntityFieldGroupDefinition(element)) {
      generateGranularRevisionFields({
        context,
        documents,
        elements: element.children as Array<IFormElement<any, any>>,
        stack,
        revisionFields,
        entityType: element.params?.type,
      });

      continue;
    }

    if (isDocumentFieldDefinition(element)) {
      const document = documents.find(doc => {
        if (entityType !== 'business') {
          return (
            doc.type === element.params?.template?.type &&
            doc.category === element.params?.template?.category &&
            doc.endUserId
          );
        }

        return (
          doc.type === element.params?.template?.type &&
          doc.category === element.params?.template?.category
        );
      });

      const isRevisionOrRequested =
        document?.status === 'requested' || document?.decision === 'revisions';

      if (!isRevisionOrRequested) {
        continue;
      }

      const priorityFieldComment = [document?.decisionReason, document?.comment]
        .filter(Boolean)
        .join(' - ');

      revisionFields.push({
        id: document.endUserId
          ? formatId(`${element.id}-${document.endUserId}-*`, [])
          : formatId(element.id, stack),
        reason: priorityFieldComment,
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
        generateGranularRevisionFields({
          context,
          documents,
          elements: element.children as Array<IFormElement<any, any>>,
          stack: [...stack, index],
          entityType,
          revisionFields,
        });
      });
    }
  }

  return revisionFields;
};
