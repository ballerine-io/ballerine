import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowById, fetchWorkflows } from './fetchers';
import {QueryClient} from "@tanstack/react-query";

const WORKFLOWS_LIST_PAGINATION_META_KEY = ['list-pagination'];
export const getPaginationMeta = (client: QueryClient) => client.getQueryData<{ totalItems: number, totalPages: number}>(WORKFLOWS_LIST_PAGINATION_META_KEY);
export const workflowsQueryKeys = createQueryKeys('workflows', {
  list: ({
    sortBy,
    sortDir,
    page,
    pageSize,
    ...params
  }: {
    filterId: string;
    sortBy: string;
    sortDir: string;
    page: number;
    pageSize: number;
    search: string;
    filter: Record<string, unknown>;
  }, client: QueryClient) => {
    const data = {
      ...params,
      orderBy: `${sortBy}:${sortDir}`,
      page: {
        number: Number(page),
        size: Number(pageSize),
      },
    };


    const fetchWorkflowsWithPaginationCache = async () => {
      const result = await fetchWorkflows(data);
      // TODO: in React-Query V5 the client is passed as part of QueryFnContext. Remove the param once we upgrade to v5.
      client?.setQueryData(WORKFLOWS_LIST_PAGINATION_META_KEY, result?.meta);
      return result;
    }
    return {
      queryKey: [data],
      queryFn: (()=> fetchWorkflowsWithPaginationCache()),
    };
  },
  byId: ({ workflowId }: { workflowId: string }) => ({
    queryKey: [{ workflowId }],
    queryFn: () => fetchWorkflowById({ workflowId }),
  }),
});
