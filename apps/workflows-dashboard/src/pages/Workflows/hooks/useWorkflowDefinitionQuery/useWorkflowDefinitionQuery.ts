import { workflowKeys } from '@app/domains/workflows';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowDefinitionQuery = (workflowId?: string) => {
  const { data, isLoading } = useQuery({
    ...workflowKeys.workflowDefinition({ workflowId: workflowId! }),
    enabled: Boolean(workflowId),
  });

  return {
    data,
    isLoading,
  };
};
