import { fetchLogout } from '@app/domains/auth/api/logout';
import { sessionKeys } from '@app/domains/auth/api/session/query-keys';
import { queryClient } from '@app/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  const { mutate } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => queryClient.invalidateQueries(sessionKeys.details()),
  });

  return {
    logout: mutate,
  };
}
