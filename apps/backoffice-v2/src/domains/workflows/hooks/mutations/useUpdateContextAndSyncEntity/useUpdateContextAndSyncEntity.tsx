import { TWorkflowById, updateContextAndSyncEntity } from '@/domains/workflows/fetchers';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { workflowsQueryKeys } from '../../../query-keys';

export const useUpdateContextAndSyncEntityMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TWorkflowById['context']>) =>
      await updateContextAndSyncEntity({
        workflowId,
        data,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:update_details.success'));
    },
    onError: () => {
      toast.error(t('toast:update_details.error'));
    },
  });
};
