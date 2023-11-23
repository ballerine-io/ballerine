import { fetchLogout } from '@/domains/auth/api/logout';
import { sessionKeys } from '@/domains/auth/api/session/query-keys';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';

export function useLogoutMutation() {
  const { mutate } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => queryClient.invalidateQueries(sessionKeys.details()),
  });

  return {
    logout: mutate,
  };
}
