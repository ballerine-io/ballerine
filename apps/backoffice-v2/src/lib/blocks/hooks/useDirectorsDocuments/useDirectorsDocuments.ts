import { useWorkflowDocumentsAdapter } from '@/domains/documents/hooks/adapters/useWorkflowDocumentsAdapter/useWorkflowDocumentsAdapter';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';
import { getDirectorsIdsFromWorkflow } from './helpers/get-directors-ids-from-workflow';

export const useDirectorsDocuments = (workflow: TWorkflowById) => {
  const entityIds = useMemo(() => getDirectorsIdsFromWorkflow(workflow), [workflow]);

  const { documents, documentsSchemas, isLoading } = useWorkflowDocumentsAdapter({
    entityIds,
    // TODO: Remove once documents v1 are deprecated
    documents: (workflow?.context?.entity?.data?.additionalInfo?.directors?.flatMap(
      director => director.documents ?? [],
    ) ?? []) as TDocument[],
  });

  return { documents, documentsSchemas, isLoading };
};
