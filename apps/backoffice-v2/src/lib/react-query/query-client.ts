import { isErrorWithMessage, isErrorWithCode } from '@ballerine/common';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isZodError } from '../../common/utils/is-zod-error/is-zod-error';
import { env } from '../../common/env/env';
import { authQueryKeys } from '../../domains/auth/query-keys';

async function clearAuthenticatedUser(queryClient: QueryClient) {
  try {
    await queryClient.cancelQueries();

    queryClient.clear();

    const authenticatedUser = authQueryKeys.authenticatedUser();

    queryClient.setQueryData(authenticatedUser.queryKey, {
      user: undefined,
    });
  } catch (error) {
    console.error('Couldnt clear user state from query client', error);
  }
}
// TODO: Add i18n plurals
// TODO: Make accessing translations typesafe (json properties)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Otherwise a simple 'Unauthorized (401)' error could cause a retry
      // until the user signs in.
      retry: false,
      refetchInterval: env.VITE_POLLING_INTERVAL,
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      if (isZodError(error)) {
        return;
      }

      if (!isErrorWithCode(error)) throw error;

      const status = error.code;

      if (status === 401) {
        void clearAuthenticatedUser(queryClient);
      }

      // Dont toast for no important errors
      if ([401, 403, 404].includes(status)) return;

      if (!isErrorWithMessage(error) || error.message === 'undefined' || error.message === 'null') {
        return;
      }

      toast.error(error.message, {
        id: error.message,
      });
    },
  }),
});
