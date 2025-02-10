import { apiClient } from '@/common/api-client/api-client';

import { Method } from '@/common/enums';

import { z } from 'zod';

import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';

export const useCreateUboMutation = ({
  workflowId,
  onSuccess,
}: {
  workflowId: string;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ubo: Record<string, unknown>) => {
      const [data, error] = await apiClient({
        endpoint: `../case-management/workflows/${workflowId}/ubos`,
        method: Method.POST,
        body: ubo,
        schema: z.undefined(),
      });

      return handleZodError(error, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries();
      toast.success(t('toast:ubo_created.success'));
      onSuccess();
    },
    onError: () => {
      toast.error(t('toast:ubo_created.error'));
    },
  });
};
