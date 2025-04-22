import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { collectionFlowQuerykeys, createEndUserRequest } from '@/domains/collection-flow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';

export const useCreateEndUserMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const workflowId = useWorkflowId();
  const { language } = useLanguageParam();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: createEndUserRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries(collectionFlowQuerykeys.getEndUser());

      const searchParamsString = new URLSearchParams({
        ...(workflowId ? { workflowId } : {}),
        ...(accessToken ? { token: accessToken } : {}),
        lng: language,
      }).toString();

      navigate(`/collection-flow/?${searchParamsString}`);
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
