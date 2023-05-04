import { Method } from '../enums';
import { IEndpoint, IWorkflowId } from './interfaces';

/**
 * @description The API's endpoints. The endpoints are appended into the API's base url ({@link env.VITE_API_URL}) by {@link apiClient}.
 *
 * @see {@link apiClient}
 */
export const endpoints = {
  auth: {
    signIn: {
      default: {
        endpoint: () => `auth/login`,
        method: Method.POST,
      },
      google: {
        endpoint: () => `auth/sign-in/google`,
        method: Method.POST,
      },
    },
    signOut: {
      endpoint: () => `auth/logout`,
      method: Method.POST,
    },
    getSession: {
      endpoint: () => `auth/session`,
      method: Method.GET,
    },
  },
  endUsers: {
    list: {
      endpoint: (filterId: string) => `end-users?filterId=${filterId}`,
      method: Method.GET,
    },
    byId: {
      endpoint: (endUserId: string) => `end-users/${endUserId}`,
      method: Method.GET,
    },
    // Unused
    updateById: {
      endpoint: (endUserId: string) => `end-users/${endUserId}`,
      method: Method.PATCH,
    },
  },
  businesses: {
    list: {
      endpoint: (filterId: string) => `businesses?filterId=${filterId}`,
      method: Method.GET,
    },
    byId: {
      endpoint: (businessId: string) => `businesses/${businessId}`,
      method: Method.GET,
    },
    // Unused
    updateById: {
      endpoint: (businessId: string) => `businesses/${businessId}`,
      method: Method.PATCH,
    },
  },
  workflows: {
    list: {
      endpoint: () => `workflows/active-states`,
      method: Method.GET,
    },
    byId: {
      endpoint: ({ workflowId }: IWorkflowId) => `workflows/${workflowId}`,
      method: Method.GET,
    },
    updateById: {
      endpoint: ({ workflowId }: IWorkflowId) => `workflows/${workflowId}`,
      method: Method.PATCH,
    },
    event: {
      endpoint: ({ workflowId }: IWorkflowId) => `workflows/${workflowId}/event`,
      method: Method.POST,
    },
  },
  storage: {
    fileById: {
      endpoint: (fileId: string) => `storage/${fileId}`,
      method: Method.GET,
    },
  },
} as const satisfies IEndpoint;
