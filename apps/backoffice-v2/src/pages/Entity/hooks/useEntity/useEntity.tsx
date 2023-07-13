import { useParams } from 'react-router-dom';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { cells } from './cells';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { extractCountryCodeFromWorkflow } from './utils';
import { getDocumentsByCountry } from '@ballerine/common';
import { useTasks } from '../useTasks/useTasks';

export const useEntity = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();

  const { data: workflow, isLoading } = useWorkflowQuery({ workflowId: entityId, filterId });
  const docsData = useStorageFilesQuery(
    workflow.context.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );

  const results = [];
  workflow.context.documents?.forEach((document, docIndex) => {
    document?.pages.forEach((page, pageIndex) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData.shift().data;
    });
  });
  const selectedEntity = workflow.entity;
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = !!issuerCountryCode && getDocumentsByCountry(issuerCountryCode);
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { documents, entity, pluginsOutput } = workflow?.context ?? {};
  const tasks = useTasks({
    pluginsOutput,
    documents,
    entity,
    parentMachine: workflow?.context?.parentMachine,
    documentsSchemas,
    caseState,
    docsData,
    results,
  });

  return {
    selectedEntity,
    cells,
    tasks,
    workflow,
    isLoading,
  };
};
