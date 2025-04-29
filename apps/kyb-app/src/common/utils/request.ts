import { getAccessToken } from '@/helpers/get-access-token.helper';
import * as Sentry from '@sentry/react';
import ky, { HTTPError, Options } from 'ky';
import { isExceptionWillBeHandled } from './helpers';

export const instance = ky.create({
  prefixUrl:
    (globalThis as any).env?.VITE_API_URL ??
    (import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1/`),
  retry: {
    limit: 1,
    statusCodes: [500, 408, 404, 404, 403, 401],
    methods: ['get'],
  },
  credentials: 'include',
  timeout: 30_000,
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set('Authorization', `Bearer ${getAccessToken()}`);
      },
    ],
    beforeError: [
      // TODO: catch Workflowsdk API Plugin errors as well
      async (error: HTTPError) => {
        const { request, response } = error;

        let responseBody = '';

        try {
          responseBody = await error.response.clone().text();
          const responseJson = await error.response.clone().json();

          const isShouldIgnore = isExceptionWillBeHandled({
            message: (responseJson as { message: string }).message,
          } as HTTPError);

          if (isShouldIgnore) {
            return error as HTTPError;
          }

          throw error;
        } catch (error) {
          Sentry.withScope(scope => {
            // group errors together based on their request and response
            scope.setFingerprint([
              request.method,
              request.url,
              String((error as HTTPError).response.status),
              getAccessToken() || 'anonymous',
            ]);
            Sentry.setUser({
              id: getAccessToken() || 'anonymous',
            });

            Sentry.captureException(error, {
              extra: {
                ErrorMessage: `StatusCode: ${response?.status}, URL:${response?.url}`,
                // @ts-ignore
                reqId: response?.headers?.['X-Request-ID'],
                bodyRaw: responseBody,
              },
            });
          });

          return error as HTTPError;
        }
      },
    ],
  },
});

const addWorkflowId = (options?: Options) => {
  const workflowId = new URLSearchParams(window.location.search).get('workflowId');

  if (!workflowId) {
    return options;
  }

  if (!options?.searchParams) {
    return {
      ...options,
      searchParams: { workflowId },
    };
  }

  const searchParams =
    typeof options.searchParams === 'string' || options.searchParams instanceof URLSearchParams
      ? Object.fromEntries(new URLSearchParams(options.searchParams))
      : options.searchParams;

  return {
    ...options,
    searchParams: { ...searchParams, workflowId },
  };
};

export const request = {
  get: (url: string, options?: Options) => instance.get(url, addWorkflowId(options)),
  post: (url: string, options?: Options) => instance.post(url, addWorkflowId(options)),
  put: (url: string, options?: Options) => instance.put(url, addWorkflowId(options)),
  patch: (url: string, options?: Options) => instance.patch(url, addWorkflowId(options)),
  delete: (url: string, options?: Options) => instance.delete(url, addWorkflowId(options)),
};
