import {
  IWorkflowDefinition,
  upgradeWorkflowDefinitionVersionById,
  UpgradeWorkflowDefinitionVersionByIdDto,
} from '@/domains/workflow-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpgradeWorkflowDefinitionVersionMutation = () => {
  return useMutation({
    mutationFn: async (dto: UpgradeWorkflowDefinitionVersionByIdDto) =>
      upgradeWorkflowDefinitionVersionById(dto),
    onMutate(dto) {
      const queryKeys = [
        'workflowDefinitions',
        'get',
        { query: { workflowDefinitionId: dto.workflowDefinitionId } },
      ];

      const previousDefinition = queryClient.getQueryData<IWorkflowDefinition>(queryKeys);

      queryClient.setQueryData(queryKeys, {
        ...previousDefinition,
        version: previousDefinition?.version! + 1,
      });
    },
    onSuccess: () => {
      toast.success('Workflow definition version upgraded.');
    },
    onError: () => {
      toast.error('Failed to upgrade workflow definition version.');
    },
  });
};
