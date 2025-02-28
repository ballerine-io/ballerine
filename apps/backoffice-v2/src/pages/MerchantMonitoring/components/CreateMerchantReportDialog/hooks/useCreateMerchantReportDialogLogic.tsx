import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateBusinessReportMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportMutation/useCreateBusinessReportMutation';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import {
  CreateBusinessReportDialogInput,
  CreateBusinessReportDialogSchema,
} from '../../../schemas';

export const useCreateMerchantReportDialogLogic = ({
  toggleOpen: toggleOpenProps,
}: {
  toggleOpen: (val?: boolean) => void;
}) => {
  const { data: customer } = useCustomerQuery();
  const { reportsLeft, demoDaysLeft } = customer?.config?.demoAccessDetails ?? {};

  const form = useForm({
    defaultValues: {
      websiteUrl: '',
      companyName: undefined,
      businessCorrelationId: undefined,
    },
    resolver: zodResolver(CreateBusinessReportDialogSchema),
  });
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

  const toggleOpen = useCallback(
    (val?: boolean) => {
      toggleOpenProps(val);

      if (!val) {
        setShowSuccess(false);
        form.reset();
      }
    },
    [toggleOpenProps, setShowSuccess, form],
  );

  return {
    form,
    showSuccess,
    isSubmitting,
    onSubmit,
    reportsLeft,
    demoDaysLeft,
    toggleOpen,
  };
};
