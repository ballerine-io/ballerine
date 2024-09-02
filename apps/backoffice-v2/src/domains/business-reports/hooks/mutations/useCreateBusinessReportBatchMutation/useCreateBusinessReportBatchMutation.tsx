import { t } from 'i18next';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import { TBusinessReportType } from '@/domains/business-reports/types';
import { createBatchBusinessReport } from '@/domains/business-reports/fetchers';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/useCustomerQuery';

export const useCreateBusinessReportBatchMutation = ({
  reportType,
  onSuccess,
}: {
  reportType: TBusinessReportType;
  onSuccess?: <TData>(data: TData) => void;
}) => {
  const queryClient = useQueryClient();

  const { data: customer } = useCustomerQuery();

  return useMutation({
    mutationFn: (merchantSheet: string) =>
      createBatchBusinessReport({
        reportType,
        merchantSheet,
        isExample: customer?.config?.isExample ?? false,
      }),
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:batch_business_report_creation.success`));

      onSuccess?.(data);
    },
    onError: (error: Error) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(t(`toast:batch_business_report_creation.error`, { errorMessage: error.message }));
    },
  });
};
