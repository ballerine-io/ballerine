import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { CreateKybAndUboCheckDialogSchema } from '../../../schemas';
import { TCreateKybAndUbosCheckPayload } from '@/domains/checks/fetchers';
import { useCreateKybAndUbosCheckMutation } from '@/domains/checks/hooks/mutations/useCreateKybAndUbosCheckMutation/useCreateKybAndUbosCheckMutation';

export const useCreateKybAndUboCheckDialogLogic = ({
  toggleOpen: toggleOpenProps,
}: {
  toggleOpen: (val?: boolean) => void;
}) => {
  const { data: customer } = useCustomerQuery();
  const { reportsLeft, demoDaysLeft } = customer?.config?.demoAccessDetails ?? {};

  const form = useForm({
    defaultValues: {
      companyName: undefined,
      registrationNumber: undefined,
      country: undefined,
      state: undefined,
      correlationId: undefined,
    },
    resolver: zodResolver(CreateKybAndUboCheckDialogSchema),
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: mutateCreateKybAndUboCheck, isLoading: isSubmitting } =
    useCreateKybAndUbosCheckMutation({
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  const onSubmit: SubmitHandler<TCreateKybAndUbosCheckPayload> = data => {
    mutateCreateKybAndUboCheck(data);
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
