import { ServerNotAvailableError } from '@/common/errors/server-not-available';
import { getAccessToken } from '@/helpers/get-access-token.helper';
import * as Sentry from '@sentry/react';
import ky, { HTTPError } from 'ky';

export const request = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1/`,
  retry: {
    limit: 1,
    statusCodes: [500, 408, 404, 404, 403, 401, 0],
    methods: ['get'],
  },
  timeout: 30_000,
  fetch: (input, init) => {
    return fetch(input, init).catch(error => {
      if (!error?.response?.statusCode) {
        throw new ServerNotAvailableError();
      }

      throw error;
    });
  },
  hooks: {
    beforeRequest: [
      request => {
        if (!navigator.onLine) {
          throw new ServerNotAvailableError();
        }

        request.headers.set('Authorization', `Bearer ${getAccessToken()}`);
      },
    ],
    beforeError: [
      // TODO: catch Workflowsdk API Plugin errors as well
      async (error: HTTPError) => {
        const { request, response } = error;

        // Check if server is not available
        if (!response || error.name === 'TimeoutError') {
          throw new ServerNotAvailableError();
        }

        let responseBody = '';

        try {
          responseBody = await error.response.clone().text();
        } catch (_) {
          /* empty */
        }

        Sentry.withScope(scope => {
          // group errors together based on their request and response
          scope.setFingerprint([
            request.method,
            request.url,
            String(error.response.status),
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

        return error;
      },
    ],
  },
});
