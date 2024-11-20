import {
  fetchCollectionFlowSchema,
  fetchCustomer,
  fetchEndUser,
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
  getUISchema: ({ language, endUserId }: { language: string; endUserId?: string }) => ({
    queryKey: [{ language, endUserId }],
    queryFn: () => fetchUISchema(language, endUserId),
  }),
  getCustomer: () => ({
    queryKey: [{}],
    queryFn: () => fetchCustomer(),
  }),
  getContext: () => ({
    queryKey: [{}],
    queryFn: () => fetchFlowContext(),
  }),
  getEndUser: () => ({
    queryKey: [{}],
    queryFn: () => fetchEndUser(),
  }),
});
