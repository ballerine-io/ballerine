import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/useCustomerQuery';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useGeneratePDFMutation } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/mutations/useGeneratePDFMutation/useGeneratePDFMutation';

export const useCaseOptionsLogic = () => {
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
