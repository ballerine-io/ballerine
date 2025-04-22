import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  formatWildcardId,
  IFormElement,
  IPriorityField,
  TBaseFields,
  TDeepthLevelStack,
} from '@ballerine/ui';

// Converts all provided elements in to revision fields;

export const generateRevisionFieldsForAllElements = (
  context: CollectionFlowContext,
  elements: Array<IFormElement<TBaseFields, any>>,
  stack: TDeepthLevelStack = [],
  revisionFields: IPriorityField[] = [],
) => {
  for (const element of elements) {
    revisionFields.push({
      id: formatWildcardId(element.id),
      reason: '',
    });

    if (Array.isArray(element.children) && element.children.length > 0) {
      generateRevisionFieldsForAllElements(
        context,
        element.children as Array<IFormElement<any, any>>,
        stack,
        revisionFields,
      );
    }
  }

  return revisionFields;
};
