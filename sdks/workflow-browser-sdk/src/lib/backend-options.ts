import type { BackendOptions } from './types';

export const backendOptions = {
  baseUrl: 'https://api-dev.ballerine.io/external',
  endpoints: {
    persist: {
      endpoint: '/workflows/:workflowId',
      method: 'PATCH',
    },
    uploadFile: {
      endpoint: '/storage',
      method: 'POST',
    },
  },
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
    credentials: 'include',
  },
} as const satisfies BackendOptions;
