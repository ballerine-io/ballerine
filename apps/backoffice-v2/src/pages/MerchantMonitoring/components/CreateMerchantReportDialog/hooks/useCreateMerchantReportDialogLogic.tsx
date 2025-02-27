import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateBusinessReportMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportMutation/useCreateBusinessReportMutation';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import {
  CreateBusinessReportDialogInput,
  CreateBusinessReportDialogSchema,
} from '../../../schemas';
import { useToggle } from '@/common/hooks/useToggle/useToggle';

type UseCreateMerchantReportDialogLogicProps = {
  open?: boolean;
  toggleOpen?: (next?: boolean) => void;
};
export const useCreateMerchantReportDialogLogic = ({
  open: propsOpen,
  toggleOpen: propsToggleOpen,
}: UseCreateMerchantReportDialogLogicProps) => {
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
  const [open, toggleOpenBase] = useToggle(propsOpen ?? false);
  const toggleOpen = (next?: boolean) => {
    toggleOpenBase(next);

    if (propsToggleOpen) {
      propsToggleOpen(next);
    }

    if (!next) {
      setShowSuccess(false);
      form.reset();
    }
  };
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

  return {
    form,
    showSuccess,
    isSubmitting,
    onSubmit,
    open,
    toggleOpen,
    reportsLeft,
    demoDaysLeft,
  };
};
