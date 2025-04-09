import { getAccessToken } from '@/helpers/get-access-token.helper';
import * as Sentry from '@sentry/react';
import ky, { HTTPError } from 'ky';
import { isExceptionWillBeHandled } from './helpers';

const instance = ky.create({
  //@ts-ignore
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

const addWorkflowId = (url: string) => {
  const workflowId = window.location.pathname.split('/')[2] || null;

  if (!workflowId) {
    return url;
  }

  return `${url.replace(/\/$/, '')}/${workflowId}`;
};

export const request = {
  get: (url: string, options?: Parameters<typeof instance.get>[1]) =>
    instance.get(addWorkflowId(url), options),
  post: (url: string, options?: Parameters<typeof instance.post>[1]) =>
    instance.post(addWorkflowId(url), options),
  put: (url: string, options?: Parameters<typeof instance.put>[1]) =>
    instance.put(addWorkflowId(url), options),
  patch: (url: string, options?: Parameters<typeof instance.patch>[1]) =>
    instance.patch(addWorkflowId(url), options),
  delete: (url: string, options?: Parameters<typeof instance.delete>[1]) =>
    instance.delete(addWorkflowId(url), options),
};
