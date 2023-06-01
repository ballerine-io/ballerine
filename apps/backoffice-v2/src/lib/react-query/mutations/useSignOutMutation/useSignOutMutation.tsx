import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { api } from '../../../../api/api';
import { auth } from '../../auth';
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
    onMutate: () => {
      queryClient.cancelQueries();
    },
    onSuccess: (data, { callbackUrl, redirect }) => {
      queryClient.setQueryData(getSession.queryKey, undefined);

      if (!callbackUrl || !redirect) return;

      navigate({
        to: callbackUrl,
        replace: true,
        search: undefined,
        params: undefined,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getSession.queryKey });
    },
  });
};
