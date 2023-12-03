import { IErrorWithMessage, isObject } from '@ballerine/common';
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

export const isErrorWithMessage = (error: unknown): error is IErrorWithMessage => {
  return isObject(error) && 'message' in error && typeof error.message === 'string';
};

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
    onError: (error: IErrorWithCode | IErrorWithMessage) => {
      if (isZodError(error)) {
        toast.error(t('toast:validation_error'));
        return;
      }

      if (!isErrorWithMessage(error) || error.message === 'undefined' || error.message === 'null') {
        return;
      }

      if (isErrorWithCode(error)) {
        const statusCode = error.code;
        if (statusCode === 401) {
          void clearAuthenticatedUser(queryClient);
        }

        // Dont toast for no important errors
        if (
          statusCode === undefined ||
          (statusCode >= 400 && ![401, 403, 404].includes(statusCode))
        ) {
          toast.error(error.message, {
            id: error.message,
          });
        }
      }
    },
  }),
});
