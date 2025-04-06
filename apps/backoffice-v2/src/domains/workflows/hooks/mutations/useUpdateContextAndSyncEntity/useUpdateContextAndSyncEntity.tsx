import { TWorkflowById, updateContextAndSyncEntity } from '@/domains/workflows/fetchers';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { workflowsQueryKeys } from '../../../query-keys';

export const useUpdateContextAndSyncEntityMutation = ({
  workflowId,
  onSuccess,
}: {
  workflowId: string;
  onSuccess?: (data: null, variables: Partial<TWorkflowById['context']>, context: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TWorkflowById['context']>) =>
      await updateContextAndSyncEntity({
        workflowId,
        data,
      }),
    onSuccess: (...args) => {
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:update_details.success'));

      onSuccess?.(...args);
    },
    onError: () => {
      toast.error(t('toast:update_details.error'));
    },
  });
};
