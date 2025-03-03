import { toast } from 'sonner';
import type { UpdateableReportStatus } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import { updateReportStatus } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/fetchers';
import { t } from 'i18next';

export const useUpdateReportStatusMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: Awaited<ReturnType<typeof updateReportStatus>>) => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      status,
      reportId,
    }: {
      text?: string;
      reportId?: string;
      status?: UpdateableReportStatus;
    }) => {
      if (!reportId || !status) {
        return;
      }

      return await updateReportStatus({ reportId, status });
    },
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:business_report_status_update.success`));
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(t(`toast:business_report_status_update.error`));
      onError?.(error);
    },
  });
};
