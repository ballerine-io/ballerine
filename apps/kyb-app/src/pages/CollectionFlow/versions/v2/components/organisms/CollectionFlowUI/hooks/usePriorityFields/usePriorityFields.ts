import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { IFormElement } from '@ballerine/ui';
import { useMemo } from 'react';
import { generatePriorityFields } from './utils/generate-priority-fields';

export const usePriorityFields = (
  elements: Array<IFormElement<any, any>>,
  context: CollectionFlowContext,
  skip?: boolean,
) => {
  const priorityFields = useMemo(
    () => (skip ? undefined : generatePriorityFields(elements, context)),
    [elements, context, skip],
  );

  return priorityFields;
};
