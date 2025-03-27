import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useMemo } from 'react';
import { generateFieldsForRevision } from './utils/generate-fields-for-revision';

export const useRevisionFields = (pages: Array<UIPage<'v2'>>, context: CollectionFlowContext) => {
  // Generating priority fields once per session
  const revisionFields = useMemo(() => generateFieldsForRevision(pages, context), []);

  return revisionFields;
};
