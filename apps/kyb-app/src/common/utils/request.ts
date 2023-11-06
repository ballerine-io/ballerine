import { getAccessToken } from '@app/helpers/get-access-token.helper';
import ky, { HTTPError } from 'ky';
import * as Sentry from '@sentry/react';

export const request = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1/`,
  retry: {
    limit: 1,
    statusCodes: [500, 408, 404, 404, 403, 401],
    methods: ['get'],
  },
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
          responseBody = await error.response.text();
        } catch (_) {
          /* empty */
        }

        Sentry.withScope(function (scope) {
          // group errors together based on their request and response
          scope.setFingerprint([
            request.method,
            request.url,
            String(error.response.status),
            getAccessToken(),
          ]);
          Sentry.setUser({
            id: getAccessToken(),
          });

          Sentry.captureException(error, {
            extra: {
              ErrorMessage: `StatusCode: ${response?.status}, URL:${response?.url}`,
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
