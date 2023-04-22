import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';
import { z } from 'zod';
import { handleZodError } from '@/utils/handle-zod-error/handle-zod-error';

export const useStorageFilesQuery = (workflowId: string) => {
  return useQuery({
    queryKey: ['storage', { workflowId }],
    queryFn: async () => {
      const [data, error] = await apiClient({
        endpoint: `storage`,
        method: 'GET',
        schema: z.array(z.instanceof(Blob)),
      });

      return handleZodError(data, error);
    },
  });
};
