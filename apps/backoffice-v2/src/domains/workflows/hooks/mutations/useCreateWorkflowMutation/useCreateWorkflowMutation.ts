import { createWorkflow } from '@/domains/workflows/fetchers';
import { AnyObject } from '@ballerine/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface WorkflowCreationParams {
  workflowDefinitionId: string;
  entityData: AnyObject;
}

export const useCreateWorkflowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workflowDefinitionId,
      context,
      config,
    }: {
      workflowDefinitionId: string;
      context: AnyObject;
      config: AnyObject;
    }) =>
      createWorkflow({
        workflowDefinitionId: workflowDefinitionId,
        context,
        config,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();

      toast.success('Case created.');
    },
    onError: () => {
      toast.error(`Failed to create case.`);
    },
  });
};
