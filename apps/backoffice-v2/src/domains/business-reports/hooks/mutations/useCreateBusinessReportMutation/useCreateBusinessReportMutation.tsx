import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { createBusinessReport } from '@/domains/business-reports/fetchers';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { HttpError } from '@/common/errors/http-error';
import { isObject } from '@ballerine/common';

export const useCreateBusinessReportMutation = ({
  onSuccess,
}: {
  onSuccess?: <TData>(data: TData) => void;
}) => {
  const queryClient = useQueryClient();
  const { data: customer } = useCustomerQuery();

  const reportType = customer?.features?.createBusinessReport?.options.type ?? 'MERCHANT_REPORT_T1';
  const workflowVersion = customer?.features?.createBusinessReport?.options.version ?? '2';

  return useMutation({
    mutationFn: async ({
      websiteUrl,
      operatingCountry,
      companyName,
      businessCorrelationId,
    }:
      | {
          websiteUrl: string;
          operatingCountry?: string;
          companyName: string;
        }
      | {
          websiteUrl: string;
          operatingCountry: string;
          businessCorrelationId: string;
        }) => {
      await createBusinessReport({
        websiteUrl,
        operatingCountry,
        companyName,
        businessCorrelationId,
        reportType,
        workflowVersion,
        isExample: customer?.config?.isExample ?? false,
      });

      // Artificial delay to ensure report is created in Unified API's DB
      await new Promise(resolve => setTimeout(resolve, 3000));
    },
    onSuccess: data => {
      if (customer?.config?.isExample) {
        return;
      }

      void queryClient.invalidateQueries();

      toast.success(t(`toast:business_report_creation.success`));
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(
        t(`toast:business_report_creation.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });
};
