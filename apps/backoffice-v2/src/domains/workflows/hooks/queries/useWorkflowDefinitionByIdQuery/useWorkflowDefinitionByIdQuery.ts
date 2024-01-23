import { useQuery } from '@tanstack/react-query';
import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowDefinitionByIdQuery = ({
  workflowDefinitionId,
}: {
  workflowDefinitionId: string;
}) => {
  return useQuery({
    ...workflowsQueryKeys.workflowDefinitionById({ workflowDefinitionId }),
    enabled: !!workflowDefinitionId,
    staleTime: 10_000,
  });
};
