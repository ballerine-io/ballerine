import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import csvContent from './batch-report-template.csv?raw';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { CreateBatchBusinessReportSchema } from '@/pages/MerchantMonitoringUploadMultiple/create-batch-business-report-schema';
import { useCreateBusinessReportBatchMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportBatchMutation/useCreateBusinessReportBatchMutation';
import { useCallback, useMemo } from 'react';

export const useMerchantMonitoringUploadMultiplePageLogic = () => {
  const form = useForm({
    defaultValues: {
      merchantSheet: undefined,
    },
  } as { defaultValues: { merchantSheet: File | undefined } });

  const locale = useLocale();
  const navigate = useNavigate();

  const { mutate: mutateCreateBusinessReportBatch } = useCreateBusinessReportBatchMutation({
    reportType: 'MERCHANT_REPORT_T1',
    onSuccess: () => {
      navigate(`/${locale}/merchant-monitoring`);
    },
  });

  const onSubmit: SubmitHandler<z.output<typeof CreateBatchBusinessReportSchema>> = ({
    merchantSheet,
  }) => {
    if (!merchantSheet) {
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
  };
};
