import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useGeneratePDFMutation } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/mutations/useGeneratePDFMutation/useGeneratePDFMutation';
import { useCopyCollectionFlowLinkMutation } from './mutations/useCopyCollectionFlowLinkMutation/useCopyCollectionFlowLinkMutation';

export const useCaseOptionsLogic = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: customer } = useCustomerQuery();
  const { isLoading, mutate: generateAndOpenPDFInNewTab } = useGeneratePDFMutation({
    workflow,
    customer,
  });
  const { mutate: copyCollectionFlowLink } = useCopyCollectionFlowLinkMutation({
    workflow,
  });

  const isCopyingCollectionFlowLink =
    !workflow?.context?.metadata?.collectionFlowUrl || !workflow?.context?.metadata?.token;

  return {
    isGeneratingPDF: isLoading,
    generateAndOpenPDFInNewTab,
    isCopyingCollectionFlowLink,
    copyCollectionFlowLink,
  };
};
