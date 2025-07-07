import { useWorkflowDocumentsAdapter } from '@/domains/documents/hooks/adapters/useWorkflowDocumentsAdapter/useWorkflowDocumentsAdapter';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';

export const useBusinessDocuments = (workflow: TWorkflowById) => {
  const entityIds = useMemo(
    () =>
      workflow?.context?.entity?.ballerineEntityId
        ? [workflow?.context?.entity?.ballerineEntityId]
        : [],
    [workflow],
  );

  const { documents, documentsSchemas, isLoading } = useWorkflowDocumentsAdapter({
    entityIds,
    documents: workflow?.context?.documents as TDocument[],
  });

  return { documents, documentsSchemas, isLoading };
};
