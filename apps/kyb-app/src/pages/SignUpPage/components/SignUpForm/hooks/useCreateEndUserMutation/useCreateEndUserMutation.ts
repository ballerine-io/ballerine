import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { collectionFlowQuerykeys, createEndUserRequest } from '@/domains/collection-flow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';
import { createQueryParamsString } from '@/common/utils/create-query-params-string';
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

      navigate(
        `/collection-flow/${workflowId}${createQueryParamsString({
          token: accessToken,
          lng: language,
        })}`,
      );
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
