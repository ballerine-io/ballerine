import { workflowDefinitionsQueryKeys } from '@/domains/workflow-definitions';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowDefinitionQuery = (workflowId?: string) => {
  console.log('keys', workflowDefinitionsQueryKeys.get({ workflowDefinitionId: workflowId! }));

  const { data, isLoading, error } = useQuery({
    ...workflowDefinitionsQueryKeys.get({ workflowDefinitionId: workflowId! }),
    // @ts-ignore
    enabled: Boolean(workflowId),
    retry: false,
  });

  return {
    data,
    isLoading,
    error,
  };
};
