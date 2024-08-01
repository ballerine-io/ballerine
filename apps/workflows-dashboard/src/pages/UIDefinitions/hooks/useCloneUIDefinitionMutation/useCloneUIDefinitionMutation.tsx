import {
  copyUIDefinition,
  CopyUIDefinitionDto,
  uiDefinitionsQueryKeys,
} from '@/domains/ui-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCloneUIDefinitionMutation = () => {
  return useMutation({
    mutationFn: async (dto: CopyUIDefinitionDto) => copyUIDefinition(dto),
    onSuccess: () => {
      const { queryKey } = uiDefinitionsQueryKeys.list();

      queryClient.invalidateQueries({ queryKey, exact: true });

      toast.success('UI Definition cloned succesfully.');
    },
    onError: () => {
      toast.error('Failed to clone ui definition.');
    },
  });
};
