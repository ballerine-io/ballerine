import { Method } from '../enums';
import { IEndpoint } from './interfaces';

export interface IFilterId {
  filterId: string;
}

/**
 * @description The API's endpoints. The endpoints are appended into the API's base url ({@link env.VITE_API_URL}) by {@link apiClient}.
 *
 * @see {@link apiClient}
 */
export const endpoints = {
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
