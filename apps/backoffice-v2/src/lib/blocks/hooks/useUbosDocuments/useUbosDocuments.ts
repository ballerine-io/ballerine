import { useDocumentsAdapter } from '@/domains/documents/hooks/useDocumentsAdapter/useDocumentsAdapter';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';
import { getUbosEntityIdsFromWorkflow } from './helpers/get-ubos-entity-ids-from-workflow';

export const useUbosDocuments = (workflow: TWorkflowById) => {
  const entityIds = useMemo(() => getUbosEntityIdsFromWorkflow(workflow), [workflow]);

  const { documents, documentsSchemas, isLoading } = useDocumentsAdapter({
    entityIds,
    documents: workflow?.context?.documents as TDocument[],
  });

  return { documents, documentsSchemas, isLoading };
};
