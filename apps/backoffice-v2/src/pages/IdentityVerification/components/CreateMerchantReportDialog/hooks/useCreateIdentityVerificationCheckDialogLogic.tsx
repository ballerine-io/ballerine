import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateBusinessReportMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportMutation/useCreateBusinessReportMutation';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import {
  CreateIdentityVerificationDialogInput,
  CreateIdentityVerificationDialogSchema,
} from '@/pages/IdentityVerification/schemas';

export const useCreateIdentityVerificationCheckDialogLogic = ({
  toggleOpen: toggleOpenProps,
}: {
  toggleOpen: (val?: boolean) => void;
}) => {
  const { data: customer } = useCustomerQuery();
  const { reportsLeft, demoDaysLeft } = customer?.config?.demoAccessDetails ?? {};

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      country: '',
      state: '',
      dateOfBirth: '',
    },
    resolver: zodResolver(CreateIdentityVerificationDialogSchema),
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: mutateCreateBusinessReport, isLoading: isSubmitting } =
    useCreateBusinessReportMutation({ disableToast: true });
  const onSubmit: SubmitHandler<CreateIdentityVerificationDialogInput> = data => {
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
