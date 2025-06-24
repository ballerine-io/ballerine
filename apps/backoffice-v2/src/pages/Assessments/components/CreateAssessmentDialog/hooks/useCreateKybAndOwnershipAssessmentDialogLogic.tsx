import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { TCreateAssessmentPayload } from '@/domains/assessments/fetchers';
import { useCreateAssessmentMutation } from '@/domains/assessments/hooks/mutations/useCreateKybAndOwnershipAssessmentMutation/useCreateKybAndOwnershipAssessmentMutation';
import { CreateKybAndOwnershipAssessmentDialogSchema } from '../../../schemas';

export const useCreateKybAndOwnershipAssessmentDialogLogic = ({
  toggleOpen: toggleOpenProps,
}: {
  toggleOpen: (val?: boolean) => void;
}) => {
  const form = useForm({
    defaultValues: {
      companyName: '',
      registrationNumber: '',
      country: '',
      state: '',
      type: 'kyb_and_ownership' as const,
      businessId: undefined,
    },
    resolver: zodResolver(CreateKybAndOwnershipAssessmentDialogSchema),
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: mutateCreateKybAndOwnershipAssessment, isLoading: isSubmitting } =
    useCreateAssessmentMutation({
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  const onSubmit: SubmitHandler<TCreateAssessmentPayload> = data => {
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
    toggleOpen,
  };
};
