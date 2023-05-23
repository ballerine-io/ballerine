import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Action, Resource } from '../../../../enums';
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

      void navigate({
        to: callbackUrl,
        replace: true,
        search: undefined,
        params: undefined,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: authenticatedUser.queryKey });
    },
  });
};
