import { Method } from '../enums';
import { IEndpoint } from './interfaces';

/**
 * @description The API's endpoints. The endpoints are appended into the API's base url ({@link env.VITE_API_URL}) by {@link apiClient}.
 *
 * @see {@link apiClient}
 */
export const endpoints = {
  auth: {
    signIn: {
      default: {
        endpoint: () => `auth/sign-in`,
        method: Method.POST,
      },
      google: {
        endpoint: () => `auth/sign-in/google`,
        method: Method.POST,
      },
    },
    signOut: {
      endpoint: () => `auth/sign-out`,
      method: Method.POST,
    },
    getSession: {
      endpoint: () => `auth/session`,
      method: Method.GET,
    },
  },
  endUsers: {
    list: {
      endpoint: () => `end-users`,
      method: Method.GET,
    },
    byId: {
      endpoint: (endUserId: string) => `end-users/${endUserId}`,
      method: Method.GET,
    },
    updateById: {
      endpoint: (endUserId: string) => `end-users/${endUserId}`,
      method: Method.PATCH,
    },
  },
} as const satisfies IEndpoint;
