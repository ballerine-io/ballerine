import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  formatId,
  formatValueDestination,
  IFormElement,
  IPriorityField,
  TBaseFields,
  TDeepthLevelStack,
} from '@ballerine/ui';
import get from 'lodash/get';

// Converts all provided elements in to revision fields;

export const generateRevisionFieldsForAllElements = (
  context: CollectionFlowContext,
  elements: Array<IFormElement<TBaseFields, any>>,
  stack: TDeepthLevelStack = [],
  revisionFields: IPriorityField[] = [],
) => {
  for (const element of elements) {
    revisionFields.push({
      id: formatId(element.id, stack),
      reason: '',
    });

    if (Array.isArray(element.children) && element.children.length > 0) {
      const value = get(context, formatValueDestination(element.valueDestination, stack));

      if (!value) {
        continue;
      }

      value?.forEach((_: unknown, index: number) => {
        generateRevisionFieldsForAllElements(
          context,
          element.children as Array<IFormElement<any, any>>,
          [...stack, index],
          revisionFields,
        );
      });
    }
  }

  return revisionFields;
};
