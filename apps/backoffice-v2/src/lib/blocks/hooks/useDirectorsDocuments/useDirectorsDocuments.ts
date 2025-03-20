import { useDocumentsAdapter } from '@/domains/documents/hooks/useDocumentsAdapter/useDocumentsAdapter';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';
import { getDirectorsIdsFromWorkflow } from './helpers/get-directors-ids-from-workflow';

export const useDirectorsDocuments = (workflow: TWorkflowById) => {
  const entityIds = useMemo(() => getDirectorsIdsFromWorkflow(workflow), [workflow]);

  const { documents, documentsSchemas, isLoading } = useDocumentsAdapter({
    entityIds,
    documents: workflow?.context?.documents as TDocument[],
  });

  return { documents, documentsSchemas, isLoading };
};
