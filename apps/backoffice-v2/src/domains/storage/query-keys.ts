import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchFileById } from './fetchers';
import { env } from '@/common/env/env';

export const storageQueryKeys = createQueryKeys('storage', {
  fileById: ({
    fileId,
    withSignedUrl = env.VITE_FETCH_SIGNED_URL,
  }: {
    fileId: string;
    withSignedUrl?: boolean;
  }) => ({
    queryKey: [{ fileId, withSignedUrl }],
    queryFn: () => fetchFileById({ fileId, withSignedUrl }),
  }),
});
