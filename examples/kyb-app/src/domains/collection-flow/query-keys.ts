import {
  fetchActiveWorkflow,
  fetchCollectionFlowSchema,
  fetchUISchema,
  getFlowSession,
} from '@app/domains/collection-flow/collection-flow.api';
import { GetActiveWorkflowDto, GetSessionDto } from '@app/domains/collection-flow/types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const collectionFlowQuerykeys = createQueryKeys('collectionFlow', {
  getCollectionFlowSchema: () => ({
    queryFn: () => fetchCollectionFlowSchema(),
    queryKey: [{}],
  }),
  getSession: (query: GetSessionDto) => ({
    queryFn: () => getFlowSession(query),
    queryKey: [{ query }],
  }),
  getFlowData: (query: GetActiveWorkflowDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchActiveWorkflow(query),
  }),
  getUISchema: () => ({
    queryKey: [{}],
    queryFn: () => fetchUISchema(),
  }),
});
