import { updateUIDefinition, UpdateUIDefinitionDto } from '@/domains/ui-definitions';
import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateUIDefinitionMutation = () => {
  return useMutation({
    mutationFn: async (dto: UpdateUIDefinitionDto) => updateUIDefinition(dto),
    onMutate(dto) {
      const queryKeys = [
        'workflowDefinitions',
        'get',
        { query: { workflowDefinitionId: dto.workflowDefinitionId } },
      ];

      const previousDefinition = queryClient.getQueryData<IWorkflowDefinition>(queryKeys);

      queryClient.setQueryData(queryKeys, {
        ...previousDefinition,
        uiDefinitions: [dto.uiDefinition],
      });
    },
    onSuccess: () => {
      toast.success('UI definition updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update UI definition.');
    },
  });
};
