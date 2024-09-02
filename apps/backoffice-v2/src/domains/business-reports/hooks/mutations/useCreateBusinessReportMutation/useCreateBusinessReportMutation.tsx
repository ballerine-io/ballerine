import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { createBusinessReport } from '@/domains/business-reports/fetchers';
import { TBusinessReportType } from '@/domains/business-reports/types';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/useCustomerQuery';
import { HttpError } from '@/common/errors/http-error';

export const useCreateBusinessReportMutation = ({
  reportType,
  onSuccess,
}: {
  reportType: TBusinessReportType;
  onSuccess?: <TData>(data: TData) => void;
}) => {
  const queryClient = useQueryClient();
  const { data: customer } = useCustomerQuery();

  return useMutation({
    mutationFn: ({
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
        }) =>
      createBusinessReport({
        websiteUrl,
        operatingCountry,
        companyName,
        businessCorrelationId,
        reportType,
        isExample: customer?.config?.isExample,
      }),
    onSuccess: data => {
      if (customer?.config?.isExample) {
        return;
      }

      void queryClient.invalidateQueries();

      toast.success(t(`toast:business_report_creation.success`));
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(t(`toast:business_report_creation.error`, { errorMessage: error.message }));
    },
  });
};
