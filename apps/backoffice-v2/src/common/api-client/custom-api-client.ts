import { fetcher } from '../utils/fetcher/fetcher';
import { env } from '../env/env';
import { IApiClient } from './interfaces';
import { handlePromise } from '../utils/handle-promise/handle-promise';

/**
 * @description API client for connecting to a custom/unified API.
 * Configured via VITE_CUSTOM_API_URL and VITE_CUSTOM_API_KEY environment variables.
 * Falls back gracefully if no custom API is configured.
 */
export const customApiClient: IApiClient = async ({ endpoint, method, options, schema, ...rest }) =>
  handlePromise(
    fetcher({
      url: `${env.VITE_CUSTOM_API_URL}/${endpoint}`,
      method,
      options: {
        ...options,
        credentials: 'include',
      },
      headers: {
        'Content-Type': 'application/json',
        ...(env.VITE_CUSTOM_API_KEY ? { Authorization: `Bearer ${env.VITE_CUSTOM_API_KEY}` } : {}),
        ...(options?.headers ?? {}),
      },
      schema,
      ...rest,
    }),
  );

export const isCustomApiConfigured = (): boolean => {
  return !!env.VITE_CUSTOM_API_URL;
};
