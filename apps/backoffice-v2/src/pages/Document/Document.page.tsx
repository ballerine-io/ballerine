import { useParams, useSearchParams } from 'react-router-dom';
import { useWorkflowQuery } from '../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { Case } from '../Entity/components/Case/Case';

export const DocumentLayout = () => {
  const { entityId, documentId } = useParams();
  const [searchParams] = useSearchParams();

  const filterId = searchParams.get('filterId');
  const { data: workflow, isLoading } = useWorkflowQuery({ workflowId: entityId, filterId });

  if (isLoading) {
    return;
  }

  const document = workflow.context.documents
    .map(({ pages }) => pages)
    .flat()
    ?.find(({ ballerineFileId }) => ballerineFileId === documentId);

  return (
    <Case.Documents
      hideOpenExternalButton
      documents={[
        { id: document.id, title: document.title, imageUrl: document.uri, fileType: document.type },
      ]}
    />
  );
};
