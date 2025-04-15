import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useGeneratePDFMutation } from './hooks/mutations/useGeneratePDFMutation';

export const useGeneratePDF = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: customer } = useCustomerQuery();
  const { isLoading, mutate: generateAndOpenPDFInNewTab } = useGeneratePDFMutation({
    workflow,
    customer,
  });

  return {
    isGeneratingPDF: isLoading,
    generateAndOpenPDFInNewTab,
  };
};
