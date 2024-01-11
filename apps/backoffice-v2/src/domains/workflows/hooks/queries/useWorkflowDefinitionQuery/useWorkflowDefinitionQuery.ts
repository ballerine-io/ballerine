import { useQuery } from '@tanstack/react-query';
import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowDefinitionQuery = ({
  workflowDefinitionId,
}: {
  workflowDefinitionId: string;
}) => {
  return useQuery({
    ...workflowsQueryKeys.workflowDefinition({ workflowDefinitionId }),
    enabled: !!workflowDefinitionId,
    staleTime: 10_000,
  });
};
