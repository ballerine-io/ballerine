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
    }: {
      workflowDefinitionId: string;
      context: AnyObject;
    }) =>
      createWorkflow({
        workflowDefinitionId: workflowDefinitionId,
        context,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();

      toast.success('Case created successfully.');
    },
    onError: () => {
      toast.error(`Failed to create case.`);
    },
  });
};
