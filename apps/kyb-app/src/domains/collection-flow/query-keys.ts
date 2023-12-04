import {
  fetchCollectionFlowSchema,
  fetchCustomer,
  fetchFlowContext,
  fetchUISchema,
  getFlowSession,
} from '@/domains/collection-flow/collection-flow.api';
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
  getUISchema: (lng?: string) => ({
    queryKey: [{}],
    queryFn: () => fetchUISchema(lng),
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
