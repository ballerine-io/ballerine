import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { CreateKybAndOwnershipAssessmentDialogSchema } from '../../../schemas';
import { TCreateKybAndOwnershipAssessmentPayload } from '@/domains/assessments/fetchers';
import { useCreateKybAndOwnershipAssessmentMutation } from '@/domains/assessments/hooks/mutations/useCreateKybAndOwnershipAssessmentMutation/useCreateKybAndOwnershipAssessmentMutation';

export const useCreateKybAndOwnershipAssessmentDialogLogic = ({
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
      businessId: undefined,
    },
    resolver: zodResolver(CreateKybAndOwnershipAssessmentDialogSchema),
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: mutateCreateKybAndOwnershipAssessment, isLoading: isSubmitting } =
    useCreateKybAndOwnershipAssessmentMutation({
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  const onSubmit: SubmitHandler<TCreateKybAndOwnershipAssessmentPayload> = data => {
    mutateCreateKybAndOwnershipAssessment(data);
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
