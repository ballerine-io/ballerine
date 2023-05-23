import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Action, Resource } from '../../../../enums';
import { ISignInProps } from './interfaces';
import { fetchSignIn } from '../../../fetchers';
import { authQueryKeys } from '../../../query-keys';

export const useSignInMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const getSession = authQueryKeys.authenticatedUser();

  return useMutation({
    mutationFn: ({ callbackUrl, body }: ISignInProps) =>
      fetchSignIn({
        callbackUrl,
        body,
      }),
    onMutate: () => ({
      resource: Resource.INDIVIDUAL,
      action: Action.SIGN_IN,
    }),
    onSuccess: (data, { callbackUrl, redirect }) => {
      queryClient.setQueryData(getSession.queryKey, data);

      if (!callbackUrl || !redirect) return;

      void navigate({
        to: callbackUrl,
        replace: true,
        search: undefined,
        params: undefined,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: getSession.queryKey,
      });
    },
  });
};
