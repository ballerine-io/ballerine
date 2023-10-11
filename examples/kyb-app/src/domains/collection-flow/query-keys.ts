import {
  fetchActiveWorkflow,
  fetchCollectionFlowSchema,
  fetchCustomer,
  getFlowSession,
} from '@app/domains/collection-flow/collection-flow.api';
import { GetActiveWorkflowDto } from '@app/domains/collection-flow/types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const collectionFlowQuerykeys = createQueryKeys('collectionFlow', {
  getCollectionFlowSchema: () => ({
    queryFn: () => fetchCollectionFlowSchema(),
    queryKey: [{}],
  }),
  getSession: () => ({
    queryFn: () => getFlowSession(),
    queryKey: [{}],
  }),
  getFlowData: (query: GetActiveWorkflowDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchActiveWorkflow(query),
  }),
  getCustomer: () => ({
    queryFn: () => fetchCustomer(),
    queryKey: [{}],
  }),
});
