import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import csvContent from './batch-report-template.csv?raw';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { CreateBusinessReportBatchSchema } from '@/pages/MerchantMonitoringUploadMultiple/create-business-report-batch-schema';
import { useCreateBusinessReportBatchMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportBatchMutation/useCreateBusinessReportBatchMutation';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const useMerchantMonitoringUploadMultiplePageLogic = () => {
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();

  const form = useForm<{ merchantSheet: File | undefined }>({
    defaultValues: {
      merchantSheet: undefined,
    },
  });

  const locale = useLocale();
  const navigate = useNavigate();

  const { mutate: mutateCreateBusinessReportBatch, isLoading: isSubmitting } =
    useCreateBusinessReportBatchMutation({
      reportType:
        customer?.features?.createBusinessReportBatch?.options.type ?? 'MERCHANT_REPORT_T1',
      workflowVersion: customer?.features?.createBusinessReportBatch?.options.version ?? '2',
      onSuccess: () => {
        navigate(`/${locale}/merchant-monitoring`);
      },
    });

  const onSubmit: SubmitHandler<z.output<typeof CreateBusinessReportBatchSchema>> = ({
    merchantSheet,
  }) => {
    if (!merchantSheet) {
      toast.error(t(`toast:batch_business_report_creation.no_file`));

      return;
    }

    mutateCreateBusinessReportBatch(merchantSheet);
  };

  const csvTemplateUrl = useMemo(() => {
    const blob = new Blob([csvContent], { type: 'text/csv' });

    return URL.createObjectURL(blob);
  }, []);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (files && 'length' in files && files.length > 0 && files[0]) {
        form.setValue('merchantSheet', files[0]);
      }
    },
    [form],
  );

  return {
    form,
    locale,
    onSubmit,
    onChange,
    csvTemplateUrl,
    isCreateReportBatchReady: isLoadingCustomer || isSubmitting,
  };
};
