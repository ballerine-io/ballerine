import { apiClient } from '@/common/api-client/api-client';

import { z } from 'zod';

import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

import { toast } from 'sonner';
import { Method } from '@/common/enums';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';

export const useDeleteUbosByIdsMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const [data, error] = await apiClient({
        endpoint: `../case-management/workflows/${workflowId}/ubos`,
        method: Method.DELETE,
        body: { ids },
        schema: z.undefined(),
      });

      return handleZodError(error, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries();

      toast.success(t('toast:ubo_deleted.success'));
    },
    onError: () => {
      toast.error(t('toast:ubo_deleted.error'));
    },
  });
};
