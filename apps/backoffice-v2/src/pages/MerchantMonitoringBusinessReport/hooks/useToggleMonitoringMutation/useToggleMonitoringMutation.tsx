import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { HttpError } from '@/common/errors/http-error';
import { updateOngoingMonitoringStatus } from '@/pages/MerchantMonitoringBusinessReport/fetchers';

export const useUpdateOngoingMonitoringStatusMutation = ({
  status,
  onSuccess,
  onError,
}: {
  status: 'active' | 'inactive';
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (websiteId: string) =>
      updateOngoingMonitoringStatus({ websiteId, body: { status } }),
    onSuccess: data => {
      void queryClient.invalidateQueries();

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      onError?.(error);
    },
  });
};
