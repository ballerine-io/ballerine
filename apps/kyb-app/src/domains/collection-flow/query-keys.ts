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
  getUISchema: ({ language, endUserId }: { language: string; endUserId: string | null }) => ({
    queryKey: [{ language, endUserId }],
    queryFn: () => fetchUISchema(language, endUserId),
  }),
  getCustomer: (endUserId: string | null) => ({
    queryKey: [{ endUserId }],
    queryFn: () => fetchCustomer(),
  }),
  getContext: (endUserId: string | null) => ({
    queryKey: [{ endUserId }],
    queryFn: () => fetchFlowContext(),
  }),
  getEndUser: () => ({
    queryKey: [{}],
    queryFn: () => fetchEndUser(),
  }),
});
