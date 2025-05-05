import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { createDocumentVerificationCheck } from '@/domains/document-verification/fetchers';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().optional(),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  documentType: z.string().min(1, { message: 'Document type is required' }),
  documentFile: z
    .instanceof(File)
    .refine(file => file.size < 5 * 1024 * 1024, 'File size must be less than 5MB')
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  toggleOpen: (val?: boolean) => void;
}

export const useCreateDocumentVerificationCheckDialogLogic = ({
  toggleOpen: toggleOpenProp,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      country: '',
      state: '',
      dateOfBirth: '',
      documentType: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await createDocumentVerificationCheck(data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating document verification check:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOpen = (val?: boolean) => {
    if (val === false) {
      // Reset the form when closing the dialog
      form.reset();
      setShowSuccess(false);
    }
    toggleOpenProp(val);
  };

  // Mock data for demo
  const reportsLeft = isDemoAccount ? 5 : undefined;
  const demoDaysLeft = isDemoAccount ? 14 : undefined;

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
