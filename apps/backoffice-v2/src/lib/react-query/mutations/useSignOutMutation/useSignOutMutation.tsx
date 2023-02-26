import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { api } from '../../../../api/api';
import { auth } from '../../auth';
import { Action, Resource } from '../../../../enums';
import { ISignInProps } from '../useSignInMutation/interfaces';

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const getSession = auth.getSession();

  return useMutation({
    mutationFn: ({ callbackUrl }: ISignInProps) =>
      api.auth.signOut({
        callbackUrl,
      }),
    onMutate: () => ({
      resource: Resource.END_USER,
      action: Action.SIGN_OUT,
    }),
    onSuccess: (_data, { callbackUrl, redirect }) => {
      queryClient.setQueryData(getSession.queryKey, {
        session: false,
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
      queryClient.invalidateQueries(getSession.queryKey);
    },
  });
};
