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
    mutationFn: ({ callbackUrl, provider = 'default' }: ISignInProps) =>
      api.auth.signIn({
        callbackUrl,
        provider,
      }),
    onMutate: () => ({
      resource: Resource.END_USER,
      action: Action.SIGN_IN,
    }),
    onSuccess: (_data, { callbackUrl, redirect }) => {
      queryClient.setQueryData(getSession.queryKey, {
        session: true,
      });

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
