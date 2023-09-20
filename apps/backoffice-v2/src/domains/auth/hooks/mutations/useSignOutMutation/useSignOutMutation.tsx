import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { ISignInProps } from '../useSignInMutation/interfaces';
import { authQueryKeys } from '../../../query-keys';
import { fetchSignOut } from '../../../fetchers';

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authenticatedUser = authQueryKeys.authenticatedUser();
  const { state } = useLocation();

  return useMutation({
    mutationFn: ({ callbackUrl }: ISignInProps) =>
      fetchSignOut({
        callbackUrl,
      }),
    onMutate: () => {
      void queryClient.cancelQueries();
    },
    onSuccess: (data, { callbackUrl, redirect }) => {
      queryClient.setQueryData(authenticatedUser.queryKey, {
        user: undefined,
      });

      if (!callbackUrl || !redirect) return;

      void navigate(callbackUrl, {
        replace: true,
        state: {
          from: state?.from,
        },
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries();
    },
  });
};
