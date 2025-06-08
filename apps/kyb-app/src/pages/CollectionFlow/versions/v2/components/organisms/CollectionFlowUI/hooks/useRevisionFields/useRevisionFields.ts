import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useMemo } from 'react';
import { generateFieldsForRevision } from './utils/generate-fields-for-revision';
import { useDocumentsQuery } from '@/hooks/useDocumentsQuery';

export const useRevisionFields = (pages: Array<UIPage<'v2'>>, context: CollectionFlowContext) => {
  const { data: documents, isLoading: isDocumentsLoading } = useDocumentsQuery();
  // Generating priority fields once per session
  // Should run just once on initial load, not on every context / documents change
  const revisionFields = useMemo(() => {
    return !isDocumentsLoading ? generateFieldsForRevision(pages, context, documents || []) : [];
  }, [pages, isDocumentsLoading]);

  return {
    revisionFields,
    isLoadingRevisionFields: isDocumentsLoading,
  };
};
