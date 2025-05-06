import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { createDocumentVerificationCheck } from '@/domains/document-verification/fetchers';

// Updated schema with only required fields
const formSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required' }),
  merchantId: z.string().optional(),
  documentFiles: z
    .array(
      z
        .instanceof(File)
        .refine(file => file.size < 5 * 1024 * 1024, 'File size must be less than 5MB'),
    )
    .min(1, { message: 'At least one document is required' }),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  toggleOpen: (val?: boolean) => void;
}

// Type for the createDocumentVerificationCheck parameters
type CreateDocumentVerificationParams = Parameters<typeof createDocumentVerificationCheck>[0];

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
      companyName: '',
      merchantId: '',
      documentFiles: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Create a modified version of the data for the API
      const formData = new FormData();
      formData.append('companyName', data.companyName);
      if (data.merchantId) {
        formData.append('merchantId', data.merchantId);
      }

      // Append each file to the form data
      data.documentFiles.forEach((file, index) => {
        formData.append(`documentFile${index}`, file);
      });

      // Create current date string for date of birth (default value)
      const currentDate = new Date().toISOString().split('T')[0] as string;

      // Define parameters with exact types
      const apiParams: CreateDocumentVerificationParams = {
        firstName: data.companyName,
        lastName: data.merchantId || '',
        country: 'US',
        dateOfBirth: currentDate,
        documentType: 'company_documents',
        documentFiles: data.documentFiles,
      };

      // Use the existing API function
      await createDocumentVerificationCheck(apiParams);

      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating document verification check:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOpen = useCallback(
    (val?: boolean) => {
      if (val === false) {
        // Reset the form when closing the dialog
        form.reset();
        setShowSuccess(false);
      }
      toggleOpenProp(val);
    },
    [form, toggleOpenProp],
  );

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
