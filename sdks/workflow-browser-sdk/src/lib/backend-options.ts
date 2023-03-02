import type { BackendOptions } from './types';

export const backendOptions = {
  baseUrl: 'https://api-dev.ballerine.io',
  endpoints: {
    persist: {
      endpoint: '/workflows/:workflowId',
      method: 'PUT',
    },
  },
  headers: {
    Authorization: 'Bearer 123',
    credentials: 'include',
  },
} as const satisfies BackendOptions;
