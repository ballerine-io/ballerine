import { workflowDefinitionsQueryKeys } from '@/domains/workflow-definitions';
import { useQuery } from '@tanstack/react-query';

export const useUIDefinitionByWorkflowDefinitionIdQuery = (workflowDefinitionId: string) => {
  const { data, isLoading, error } = useQuery({
    ...workflowDefinitionsQueryKeys.uiDefinition({ workflowDefinitionId }),
    // @ts-ignore
    enabled: Boolean(workflowDefinitionId),
    retry: false,
  });

  return {
    data,
    isLoading,
    error,
  };
};
