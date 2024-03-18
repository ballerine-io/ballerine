import { getAccessToken } from '@/helpers/get-access-token.helper';
import * as Sentry from '@sentry/react';
import ky, { HTTPError } from 'ky';

async function handleHttpError(error: HTTPError) {
  const { request, response } = error;

  let responseBody = '';

  try {
    responseBody = await error.response.clone().text();
  } catch (_) {
    /* empty */
  }

  Sentry.withScope(function (scope) {
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
}

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
      handleHttpError,
    ],
  },
});
