import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { AlertState, TAlertState, updateAlertsDecisionByIds } from '@/domains/alerts/fetchers';

const getToastAction = (decision: TAlertState) => {
  if (decision === AlertState.REJECTED) {
    return 'reject_alerts' as const;
  }

  if (decision === AlertState.NOT_SUSPICIOUS) {
    return 'not_suspicious_alerts' as const;
  }

  if (decision === AlertState.UNDER_REVIEW) {
    return 'revert_decision_alerts' as const;
  }

  throw new Error(`Invalid decision: "${decision}"`);
};

export const useAlertsDecisionByIdsMutation = ({
  onSuccess,
}: {
  onSuccess?: <TData>(data: TData, { decision }: { decision: TAlertState }) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ decision, alertIds }: { decision: TAlertState; alertIds: string[] }) =>
      updateAlertsDecisionByIds({
        decision,
        alertIds,
      }),
    onSuccess: (data, { decision }) => {
      void queryClient.invalidateQueries();

      const action = getToastAction(decision);

      toast.success(t(`toast:${action}.success`));
      onSuccess?.(data, { decision });
    },
    onError: (error, { decision }) => {
      const action = getToastAction(decision);

      toast.error(t(`toast:${action}.error`));
    },
  });
};
