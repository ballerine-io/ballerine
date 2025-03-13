import { useQuery } from '@tanstack/react-query';
import { documentsQueryKeys } from '../../query-keys';

export const useDocumentsByEntityIdAndWorkflowIdQuery = ({
  workflowId,
  entityId,
}: {
  workflowId: string;
  entityId: string;
}) => {
  return useQuery({
    ...documentsQueryKeys.listByEntityIdAndWorkflowId({ workflowId, entityId }),
    enabled: !!workflowId && !!entityId,
  });
};
