import {
  IWorkflowDefinition,
  updateWorkflowDefinitionById,
  UpdateWorkflowDefinitionByIdDto,
} from '@/domains/workflow-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useWorkflowDefinitionUpdateMutation = () => {
  return useMutation({
    mutationFn: async (dto: UpdateWorkflowDefinitionByIdDto) => updateWorkflowDefinitionById(dto),
    onMutate(dto) {
      const queryKeys = [
        'workflowDefinitions',
        'get',
        { query: { workflowDefinitionId: dto.workflowDefinitionId } },
      ];

      const previousDefinition = queryClient.getQueryData<IWorkflowDefinition>(queryKeys);

      queryClient.setQueryData(queryKeys, {
        ...previousDefinition,
        definition: dto.definition,
      });
    },
    onSuccess: () => {
      toast.success('Workflow definition updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update workflow definition.');
    },
  });
};
