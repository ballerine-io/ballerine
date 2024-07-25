import {
  IWorkflowDefinition,
  updateWorkflowDefinitionExtensionsById,
  UpdateWorkflowDefinitionExtensionsByIdDto,
} from '@/domains/workflow-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useWorkflowDefinitionExtensionsUpdateMutation = () => {
  return useMutation({
    mutationFn: async (dto: UpdateWorkflowDefinitionExtensionsByIdDto) =>
      updateWorkflowDefinitionExtensionsById(dto),
    onMutate(dto) {
      const queryKeys = [
        'workflowDefinitions',
        'get',
        { query: { workflowDefinitionId: dto.workflowDefinitionId } },
      ];

      const previousDefinition = queryClient.getQueryData<IWorkflowDefinition>(queryKeys);

      queryClient.setQueryData(queryKeys, {
        ...previousDefinition,
        extensions: dto.extensions,
      });
    },
    onSuccess: () => {
      toast.success('Workflow definition extensions updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update workflow definition extensions.');
    },
  });
};
