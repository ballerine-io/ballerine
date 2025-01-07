import { t } from 'i18next';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import { isObject } from '@ballerine/common';
import { turnOngoingMonitoring } from '@/pages/MerchantMonitoringBusinessReport/fetchers';

export const useTurnMonitoringOnMutation = ({
  onSuccess,
}: {
  onSuccess?: <TData>(data: TData) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (merchantId: string) => {
      await turnOngoingMonitoring({
        merchantId,
        state: 'on',
      });
    },
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:business_monitoring_on.success`));

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(
        t(`toast:business_monitoring_on.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });
};
