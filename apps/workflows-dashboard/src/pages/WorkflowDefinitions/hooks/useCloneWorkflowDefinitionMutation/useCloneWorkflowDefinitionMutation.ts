import {
  cloneWorkflowDefinitionById,
  CloneWorkflowDefinitionByIdDto,
} from '@/domains/workflow-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCloneWorkflowDefinitionMutation = () => {
  return useMutation({
    mutationFn: async (dto: CloneWorkflowDefinitionByIdDto) => cloneWorkflowDefinitionById(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowDefinitions'] });

      toast.success('Workflow Definition cloned succesfully.');
    },
    onError: () => {
      toast.error('Failed to clone Workflow Definition.');
    },
  });
};
