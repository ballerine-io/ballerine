import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { useCreateBusinessReportMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportMutation/useCreateBusinessReportMutation';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import {
  CreateBusinessReportDialogInput,
  CreateBusinessReportDialogSchema,
} from '../../../schemas';
import dayjs from 'dayjs';

export const useCreateMerchantReportDialogLogic = () => {
  const { data: customer } = useCustomerQuery();

  const { totalReports, maxBusinessReports, expiresAt } = customer?.config?.demoAccessDetails ?? {};
  const reportsLeft = maxBusinessReports && totalReports ? maxBusinessReports - totalReports : null;
  const demoDaysLeft = expiresAt ? dayjs(expiresAt * 1000).diff(dayjs(), 'days') : null;

  const form = useForm({
    defaultValues: {
      websiteUrl: '',
      companyName: undefined,
      businessCorrelationId: undefined,
    },
    resolver: zodResolver(CreateBusinessReportDialogSchema),
  });
  const [open, toggleOpen] = useToggle(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: mutateCreateBusinessReport, isLoading: isSubmitting } =
    useCreateBusinessReportMutation({ disableToast: true });
  const onSubmit: SubmitHandler<CreateBusinessReportDialogInput> = data => {
    mutateCreateBusinessReport(data, {
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      setShowSuccess(false);
    }
  }, [open, form]);

  return {
    form,
    open,
    toggleOpen,
    showSuccess,
    reportsLeft,
    demoDaysLeft,
    isSubmitting,
    onSubmit,
  };
};
