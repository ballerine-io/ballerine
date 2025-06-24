import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { TCreateAssessmentPayload } from '@/domains/assessments/fetchers';
import { useCreateAssessmentMutation } from '@/domains/assessments/hooks/mutations/useCreateKybAndOwnershipAssessmentMutation/useCreateKybAndOwnershipAssessmentMutation';
import { CreateCompanySanctionsAssessmentDialogSchema } from '../../../schemas';

export const useCreateCompanySanctionsAssessmentDialogLogic = ({
  toggleOpen: toggleOpenProps,
}: {
  toggleOpen: (val?: boolean) => void;
}) => {
  const form = useForm({
    defaultValues: {
      companyName: '',
      country: '',
      state: '',
      businessId: undefined,
    },
    resolver: zodResolver(CreateCompanySanctionsAssessmentDialogSchema),
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: mutateCreateCompanySanctionsAssessment, isLoading: isSubmitting } =
    useCreateAssessmentMutation({
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  const onSubmit: SubmitHandler<Omit<TCreateAssessmentPayload, 'type'>> = data => {
    mutateCreateCompanySanctionsAssessment({ ...data, type: 'company_sanctions' });
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
