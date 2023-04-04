import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const storage = createQueryKeys('storage', {
  fileById: (fileId: string) => ({
    queryKey: [{ fileId }],
    queryFn: () => api.storage.fileById(fileId),
  }),
});
