import { collectionFlowQuerykeys, createEndUserRequest } from '@/domains/collection-flow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateEndUserMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: createEndUserRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries(collectionFlowQuerykeys.getEndUser());
    },
    onError: () => {
      toast.error('Failed to create user. Please try again.');
    },
  });

  return {
    createEndUserRequest: mutateAsync,
    isLoading,
  };
};
