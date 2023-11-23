import { fetchSignIn, GetSignInDto, GetSignInResponse } from '@/domains/auth/api/login';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export interface UseSignInParams {
  onSuccess?: () => void;
}

export function useSignInMutation({ onSuccess }: UseSignInParams) {
  const mutation = useMutation<GetSignInResponse, AxiosError, GetSignInDto>({
    mutationFn: fetchSignIn,
    onSuccess,
  });

  return {
    isLoading: mutation.isLoading,
    errorCode: mutation.error?.response ? mutation.error.response.status : null,
    signIn: mutation.mutate,
  };
}
