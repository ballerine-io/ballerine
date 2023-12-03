import { workflowKeys } from '@/domains/workflows';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowDefinitionQuery = (workflowId?: string) => {
  const { data, isLoading } = useQuery({
    ...workflowKeys.workflowDefinition({ workflowId: workflowId! }),
    // @ts-ignore
    enabled: Boolean(workflowId),
  });

  return {
    data,
    isLoading,
  };
};
