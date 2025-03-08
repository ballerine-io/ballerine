import { useQuery } from '@tanstack/react-query';
import { documentsQueryKeys } from '../../query-keys';

export const useDocumentsQuery = ({
  workflowId,
  entityId,
}: {
  workflowId: string;
  entityId: string;
}) => {
  return useQuery({
    ...documentsQueryKeys.list({ workflowId, entityId }),
    enabled: !!workflowId && !!entityId,
  });
};
