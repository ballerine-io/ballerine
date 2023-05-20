import { Method } from '../enums';
import { IEndpoint, IWorkflowId } from './interfaces';

export interface IFilterId {
  filterId: string;
}

/**
 * @description The API's endpoints. The endpoints are appended into the API's base url ({@link env.VITE_API_URL}) by {@link apiClient}.
 *
 * @see {@link apiClient}
 */
export const endpoints = {
  users: {
    list: {
      endpoint: () => `users`,
      method: Method.GET,
    },
  },
  businesses: {
    list: {
      endpoint: (filterId: string) => `businesses?filterId=${filterId ?? ''}`,
      method: Method.GET,
    },
    byId: {
      endpoint: ({ businessId, filterId }: { businessId: string; filterId: string }) =>
        `businesses/${businessId}?filterId=${filterId ?? ''}`,
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
  filters: {
    list: {
      endpoint: () => `filters`,
      method: Method.GET,
    },
    byId: {
      endpoint: ({ filterId }: IFilterId) => `filters/${filterId}`,
      method: Method.GET,
    },
  },
  storage: {
    fileById: {
      endpoint: (fileId: string) => `storage/${fileId}`,
      method: Method.GET,
    },
    fileContentById: {
      endpoint: (fileId: string) => `storage/content/${fileId}`,
      method: Method.GET,
    },
  },
} as const satisfies IEndpoint;
