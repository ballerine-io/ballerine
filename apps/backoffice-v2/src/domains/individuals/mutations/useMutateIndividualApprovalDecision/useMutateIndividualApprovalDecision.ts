import { useMutation } from '@tanstack/react-query';
import { TIndividualDecision, updateIndividualApprovalDecision } from '../../fetchers';
import { toast } from 'sonner';
import { t } from 'i18next';
import { queryClient } from '@/lib/react-query/query-client';
import { workflowsQueryKeys } from '@/domains/workflows/query-keys';
import { endUsersQueryKeys } from '../../query-keys';

export const useMutateIndividualApprovalDecision = () => {
  return useMutation({
    mutationFn: async ({
      endUserId,
      decision,
    }: {
      endUserId: string;
      decision: TIndividualDecision;
    }) => {
      return updateIndividualApprovalDecision({
        endUserId,
        decision,
      });
    },
    onSuccess: endUser => {
      void queryClient.invalidateQueries(workflowsQueryKeys._def);
      void queryClient.invalidateQueries(endUsersQueryKeys._def);

      if (endUser?.id) {
        void queryClient.invalidateQueries(endUsersQueryKeys.byId({ id: endUser.id }));
      }

      toast.success(t('toast:approve_individual.success'));
    },
    onError: () => {
      toast.error(t('toast:approve_individual.error'));
    },
  });
};
