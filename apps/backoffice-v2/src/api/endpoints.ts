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
    // Unused
    updateById: {
      endpoint: (endUserId: string) => `end-users/${endUserId}`,
      method: Method.PATCH,
    },
  },
  workflows: {
    list: {
      endpoint: () => `workflows`,
      method: Method.GET,
    },
    byId: {
      endpoint: ({ workflowId }: IWorkflowId) => `workflows/${workflowId}`,
      method: Method.GET,
    },
    updateById: {
      endpoint: ({ workflowId }: IWorkflowId) => `workflows/${workflowId}`,
      method: Method.PUT,
    },
    event: {
      endpoint: ({ workflowId }: IWorkflowId) => `workflows/${workflowId}/event`,
      method: Method.POST,
    },
  },
} as const satisfies IEndpoint;
