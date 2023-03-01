import type { BackendOptions } from '../types';

export const backendOptions = {
  baseUrl: 'https://api-dev.ballerine.io',
  endpoints: {
    submit: {
      endpoint: '/workflows/submit',
      method: 'POST',
    },
    persist: {
      endpoint: '/workflows/persist',
      method: 'POST',
    },
  },
  headers: {
    Authorization: 'Bearer 123',
    credentials: 'include',
  },
} as const satisfies BackendOptions;
