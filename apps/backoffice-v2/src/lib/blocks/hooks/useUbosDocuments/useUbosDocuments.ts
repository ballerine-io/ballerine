import { useWorkflowDocumentsAdapter } from '@/domains/documents/hooks/adapters/useWorkflowDocumentsAdapter/useWorkflowDocumentsAdapter';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { useMemo } from 'react';
import { getUbosEntityIdsFromWorkflow } from './helpers/get-ubos-entity-ids-from-workflow';

export const useUbosDocuments = (workflow: TWorkflowById) => {
  const entityIds = useMemo(() => getUbosEntityIdsFromWorkflow(workflow), [workflow]);

  const { documents, documentsSchemas, isLoading } = useWorkflowDocumentsAdapter({
    entityIds,
    documents: (workflow.childWorkflows
      ?.filter(childWorkflow => childWorkflow.context?.entity?.variant === 'ubo')
      ?.flatMap(childWorkflow => childWorkflow.context?.documents ?? []) ?? []) as TDocument[],
  });

  return { documents, documentsSchemas, isLoading };
};
