import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { AlertState, TAlertState, updateAlertsDecisionByIds } from '@/domains/alerts/fetchers';
import { TToastKeyWithSuccessAndError } from '@/common/types';

const getToastAction = (decision: TAlertState): TToastKeyWithSuccessAndError => {
  if (decision === AlertState.REJECTED) {
    return 'reject_alerts' as const;
  }

  if (decision === AlertState.CLEARED) {
    return 'clear_alerts' as const;
  }

  if (decision === AlertState.TRIGGERED) {
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
