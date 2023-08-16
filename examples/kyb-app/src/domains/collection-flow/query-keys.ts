import { fetchCollectionFlowSchema } from '@app/domains/collection-flow/collection-flow.api';
import { GetCollectionFlowSchemaDto } from '@app/domains/collection-flow/types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const collectionFlowQuerykeys = createQueryKeys('collectionFlow', {
  getCollectionFlowSchema: (query: GetCollectionFlowSchemaDto) => ({
    queryFn: () => fetchCollectionFlowSchema(query),
    queryKey: [{ query }],
  }),
});
