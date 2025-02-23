import { t } from 'i18next';
import { toast } from 'sonner';
import { isObject, MerchantReportType } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import { createBusinessReportBatch } from '@/domains/business-reports/fetchers';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const useCreateBusinessReportBatchMutation = ({
  reportType,
  workflowVersion,
  onSuccess,
}: {
  reportType: MerchantReportType;
  workflowVersion: string;
  onSuccess?: <TData>(data: TData) => void;
}) => {
  const queryClient = useQueryClient();

  const { data: customer } = useCustomerQuery();

  return useMutation({
    mutationFn: async (merchantSheet: File) => {
      await createBusinessReportBatch({
        reportType,
        workflowVersion,
        merchantSheet,
        isExample: customer?.config?.isExample ?? false,
      });
    },
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:batch_business_report_creation.success`));

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(
        t(`toast:batch_business_report_creation.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });
};
