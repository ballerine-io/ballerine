import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useMemo } from 'react';
import { generatePriorityFields } from '../../components/organisms/CollectionFlowUI/hooks/usePriorityFields/utils/generate-priority-fields';

export const useRevisionStates = (pages: Array<UIPage<'v2'>>, context: CollectionFlowContext) => {
  const revisionStateNames = useMemo(
    () =>
      pages
        .map(page => {
          const priorityFields = generatePriorityFields(page.elements, context);

          return priorityFields?.length ? page.stateName : null;
        })
        .filter(Boolean),
    [pages, context],
  );

  return {
    initialRevisionState: revisionStateNames[0]!,
    revisionStateNames,
  };
};
