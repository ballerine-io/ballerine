import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchCollectionFlowState } from './fetchers';

export const collectionFlowQueryKeys = createQueryKeys('collection-flow', {
  state: (workflowId: string) => ({
    queryKey: [{ workflowId }],
    queryFn: () => fetchCollectionFlowState(workflowId),
  }),
});
