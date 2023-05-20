import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { auth } from '../../auth';
import { useNavigate } from '@tanstack/react-router';
import { Action, Resource } from '../../../../enums';
import { ISignInProps } from './interfaces';

export const useSignInMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const getSession = auth.getSession();

  return useMutation({
    mutationFn: ({ callbackUrl, provider = 'default', body }: ISignInProps) =>
      api.auth.signIn({
        callbackUrl,
        provider,
        body,
      }),
    onMutate: () => ({
      resource: Resource.INDIVIDUAL,
      action: Action.SIGN_IN,
    }),
    onSuccess: (data, { callbackUrl, redirect }) => {
      queryClient.setQueryData(getSession.queryKey, data);

      if (!callbackUrl || !redirect) return;

      navigate({
        to: callbackUrl,
        replace: true,
        search: undefined,
        params: undefined,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getSession.queryKey,
      });
    },
  });
};
