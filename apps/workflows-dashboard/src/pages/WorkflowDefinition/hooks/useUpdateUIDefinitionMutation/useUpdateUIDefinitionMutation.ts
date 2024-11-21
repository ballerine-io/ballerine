import {
  uiDefinitionsQueryKeys,
  updateUIDefinition,
  UpdateUIDefinitionDto,
} from '@/domains/ui-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateUIDefinitionMutation = () => {
  return useMutation({
    mutationFn: async (dto: UpdateUIDefinitionDto) => updateUIDefinition(dto),
    onMutate(dto) {
      const { queryKey } = uiDefinitionsQueryKeys.get({ uiDefinitionId: dto.uiDefinitionId });

      queryClient.setQueryData(queryKey, dto.uiDefinition);
    },
    onSuccess: () => {
      toast.success('UI definition updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update UI definition.');
    },
  });
};
