import { createQueryKeys } from '@lukemorales/query-key-factory';

export const documentsQueryKeys = createQueryKeys('documents', {
  list: () => ({
    queryKey: ['list'],
  }),
  item: (id: string) => ({
    queryKey: ['item', id],
  }),
});
