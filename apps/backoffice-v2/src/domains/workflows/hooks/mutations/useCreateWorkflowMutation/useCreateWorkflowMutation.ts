import { TWorkflowById, createWorkflowRequest } from '@/domains/workflows/fetchers';
import { AnyObject } from '@ballerine/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';

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
      context: TWorkflowById['context'];
    }) =>
      createWorkflowRequest({
        workflowDefinitionId: workflowDefinitionId,
        context,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();

      toast.success(t('toast:case_creation.success'));
    },
    onError: () => {
      toast.error(t('toast:case_creation.error'));
    },
  });
};
