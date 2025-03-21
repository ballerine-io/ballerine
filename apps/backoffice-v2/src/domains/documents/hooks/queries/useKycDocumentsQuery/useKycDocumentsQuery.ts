import { useQuery } from '@tanstack/react-query';
import { documentsQueryKeys } from '../../query-keys';

export const useKycDocumentsQuery = ({
  workflowId,
  entityIds,
}: {
  workflowId: string;
  entityIds: string[];
}) => {
  return useQuery({
    ...documentsQueryKeys.listByEntityIdsAndWorkflowId({ workflowId, entityIds }),
    enabled: !!workflowId && !!entityIds.length,
  });
};
