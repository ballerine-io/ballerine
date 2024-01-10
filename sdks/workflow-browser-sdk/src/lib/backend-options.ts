import type { BackendOptions } from './types';

export const backendOptions = {
  baseUrl: 'https://api.ballerine.io',
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
    Authorization: 'correct_token',
    ,
  },
} as const satisfies BackendOptions;
