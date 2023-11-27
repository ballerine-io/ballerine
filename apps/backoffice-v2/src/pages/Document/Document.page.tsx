import { useParams } from 'react-router-dom';
import { useWorkflowQuery } from '../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { Case } from '../Entity/components/Case/Case';
import { useFilterId } from '../../common/hooks/useFilterId/useFilterId';
import { useStorageFilesQuery } from '../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { valueOrNA } from '../../common/utils/value-or-na/value-or-na';
import { toTitleCase } from 'string-ts';
import { useMemo } from 'react';

export const DocumentLayout = () => {
  const { entityId, documentId } = useParams();
  const filterId = useFilterId();

  const { data: workflow, isLoading: isLoadingWorkflow } = useWorkflowQuery({
    workflowId: entityId,
    filterId,
  });

  const document = useMemo(
    () =>
      workflow?.context?.documents.find(doc =>
        doc.pages.some(({ ballerineFileId }) => ballerineFileId === documentId),
      ),
    [documentId, workflow?.context?.documents],
  );

  const page = useMemo(
    () =>
      workflow?.context?.documents
        ?.flatMap(({ pages }) => pages)
        ?.find(({ ballerineFileId }) => ballerineFileId === documentId),
    [documentId, workflow?.context?.documents],
  );

  const fileIds = useMemo(
    () =>
      workflow?.context?.documents
        ?.flatMap(({ pages }) => pages?.map(({ ballerineFileId }) => ballerineFileId))
        .filter(id => id === documentId),
    [documentId, workflow?.context?.documents],
  );

  const files = useStorageFilesQuery(fileIds);

  const title = useMemo(
    () =>
      `${valueOrNA(toTitleCase(document?.category ?? ''))} - ${valueOrNA(
        toTitleCase(document?.type ?? ''),
      )}${page?.metadata?.side ? ` - ${page?.metadata?.side}` : ''}`,
    [document, page],
  );

  if (isLoadingWorkflow || files[0].isLoading) {
    return;
  }

  return (
    <Case.Documents
      hideOpenExternalButton
      documents={[{ id: fileIds[0], title, imageUrl: files[0].data, fileType: page.type }]}
    />
  );
};
