import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { collectionFlowQuerykeys, createEndUserRequest } from '@/domains/collection-flow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useCreateEndUserMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: createEndUserRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries(collectionFlowQuerykeys.getEndUser());

      navigate(`/collection-flow?token=${accessToken}`);
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
