import {
  fetchCollectionFlowSchema,
  fetchCustomer,
  fetchFlowContext,
  fetchUISchema,
  getFlowSession,
} from '@app/domains/collection-flow/collection-flow.api';
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
  getUISchema: () => ({
    queryKey: [{}],
    queryFn: () => fetchUISchema(),
  }),
  getCustomer: () => ({
    queryKey: [{}],
    queryFn: () => fetchCustomer(),
  }),
  getContext: () => ({
    queryKey: [{}],
    queryFn: () => fetchFlowContext(),
  }),
});
