import { Method } from '../enums';
import { IEndpoint, IEndUserIdAndWorkflowId } from './interfaces';

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
  workflows: {
    list: {
      endpoint: (endUserId: string) => `workflows?endUserId=${endUserId}`,
      method: Method.GET,
    },
    byId: {
      endpoint: ({ endUserId }: IEndUserIdAndWorkflowId) =>
        `workflows/${1234}?endUserId=${endUserId}&name=on-boarding&type=backoffice`,
      method: Method.GET,
    },
    updateById: {
      endpoint: ({ endUserId, workflowId }: IEndUserIdAndWorkflowId) =>
        `workflows/${workflowId}?endUserId=${endUserId}`,
      method: Method.PUT,
    },
    event: {
      endpoint: ({ endUserId, workflowId }: IEndUserIdAndWorkflowId) =>
        `workflows/${workflowId}/event?endUserId=${endUserId}`,
      method: Method.POST,
    },
  },
} as const satisfies IEndpoint;
