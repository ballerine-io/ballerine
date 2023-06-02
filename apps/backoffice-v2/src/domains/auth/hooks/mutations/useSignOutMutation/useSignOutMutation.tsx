import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Action, Resource } from '../../../../../common/enums';
import { ISignInProps } from '../useSignInMutation/interfaces';
import { authQueryKeys } from '../../../query-keys';
import { fetchSignOut } from '../../../fetchers';

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authenticatedUser = authQueryKeys.authenticatedUser();

  return useMutation({
    mutationFn: ({ callbackUrl }: ISignInProps) =>
      fetchSignOut({
        callbackUrl,
      }),
    onMutate: () => ({
      resource: Resource.INDIVIDUAL,
      action: Action.SIGN_OUT,
    }),
    onSuccess: (data, { callbackUrl, redirect }) => {
      queryClient.setQueryData(authenticatedUser.queryKey, undefined);

      if (!callbackUrl || !redirect) return;

      void navigate(callbackUrl, {
        replace: true,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: authenticatedUser.queryKey });
    },
  });
};
