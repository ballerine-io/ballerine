import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchFileById } from './fetchers';

export const storageQueryKeys = createQueryKeys('storage', {
  fileById: (fileId: string) => ({
    queryKey: [{ fileId }],
    queryFn: () => fetchFileById(fileId),
  }),
});
