import { isErrorWithMessage, isObject } from '@ballerine/common';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import toast from 'react-hot-toast';
import { isZodError } from '../../common/utils/is-zod-error/is-zod-error';
import { env } from '../../common/env/env';
import { authQueryKeys } from '../../domains/auth/query-keys';

interface IErrorWithCode {
  code: number;
}

// Use from `@ballerine/common` when a new version is released.
export const isErrorWithCode = (error: unknown): error is IErrorWithCode => {
  return isObject(error) && 'code' in error && typeof error.code === 'number';
};

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
    onError: async error => {
      if (isErrorWithCode(error) && error.code === 401) {
        const authenticatedUser = authQueryKeys.authenticatedUser();

        void queryClient.cancelQueries();
        queryClient.setQueryData(authenticatedUser.queryKey, {
          user: undefined,
        });
      }

      if (isZodError(error)) {
        toast.error(t('toast:validation_error'));

        return;
      }

      if (!isErrorWithMessage(error) || error.message === 'undefined' || error.message === 'null')
        return;

      toast.error(error.message, {
        id: error.message,
      });
    },
  }),
});
