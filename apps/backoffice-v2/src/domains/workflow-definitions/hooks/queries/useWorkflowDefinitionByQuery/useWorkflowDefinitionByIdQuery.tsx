import { workflowDefinitionsQueryKeys } from '@/domains/workflow-definitions/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowDefinitionByIdQuery = ({
  workflowDefinitionId,
}: {
  workflowDefinitionId: string;
}) => {
  return useQuery({
    ...workflowDefinitionsQueryKeys.byId({ workflowDefinitionId }),
    enabled: !!workflowDefinitionId,
    staleTime: 10_000,
  });
};
