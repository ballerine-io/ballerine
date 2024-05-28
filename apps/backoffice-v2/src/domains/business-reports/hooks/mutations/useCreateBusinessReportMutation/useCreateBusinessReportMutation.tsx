import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { createBusinessReport } from '@/domains/business-reports/fetchers';
import { TBusinessReportType } from '@/domains/business-reports/types';

export const useCreateBusinessReportMutation = ({
  reportType,
  onSuccess,
}: {
  reportType: TBusinessReportType;
  onSuccess?: <TData>(data: TData) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      websiteUrl,
      operatingCountry,
      companyName,
    }:
      | {
          websiteUrl: string;
          operatingCountry?: string;
          companyName: string;
        }
      | {
          websiteUrl: string;
          operatingCountry: string;
          businessId: string;
        }) =>
      createBusinessReport({
        websiteUrl,
        operatingCountry,
        companyName,
        reportType,
      }),
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:business_report_creation.success`));
      onSuccess?.(data);
    },
    onError: error => {
      toast.error(t(`toast:business_report_creation.error`, { errorMessage: error.message }));
    },
  });
};
