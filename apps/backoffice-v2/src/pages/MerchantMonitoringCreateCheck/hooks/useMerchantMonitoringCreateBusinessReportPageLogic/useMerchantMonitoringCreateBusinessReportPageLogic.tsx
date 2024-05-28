import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBusinessReportSchema } from '@/pages/MerchantMonitoringCreateCheck/create-business-report-schema';
import { useCreateBusinessReportMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportMutation/useCreateBusinessReportMutation';
import { z } from 'zod';
import { countryCodes } from '@ballerine/common';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const useMerchantMonitoringCreateBusinessReportPageLogic = () => {
  const form = useForm({
    defaultValues: {
      websiteUrl: undefined,
      companyName: undefined,
      operatingCountry: undefined,
      businessCorrelationId: undefined,
    },
    resolver: zodResolver(CreateBusinessReportSchema),
  });
  const { mutate: mutateCreateBusinessReport } = useCreateBusinessReportMutation({
    reportType: 'MERCHANT_REPORT_T1',
    onSuccess: () => {
      form.reset();
    },
  });
  const onSubmit: SubmitHandler<z.output<typeof CreateBusinessReportSchema>> = data => {
    mutateCreateBusinessReport(data);
  };
  const comboboxCountryCodes = countryCodes.map(countryCode => ({
    label: countryCode,
    value: countryCode,
  }));
  const locale = useLocale();

  return {
    form,
    onSubmit,
    comboboxCountryCodes,
    locale,
  };
};
