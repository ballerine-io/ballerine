import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCopyCollectionFlowLink } from '../useCopyCollectionFlowLink';
import { useEditCollectionFlow } from '../useEditCollectionFlow';
import { useGeneratePDF } from '../useGeneratePDF';

export const useCaseOptionsLogic = () => {
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = Boolean(customer?.config?.isDemoAccount);

  const { copyCollectionFlowLink, isCopyingCollectionFlowLink } = useCopyCollectionFlowLink();
  const { onEditCollectionFlow, isCanEditCollectionFlow, isLoading } = useEditCollectionFlow();
  const { generateAndOpenPDFInNewTab, isGeneratingPDF } = useGeneratePDF();

  return {
    copyCollectionFlowLink,
    isCopyingCollectionFlowLink,
    onEditCollectionFlow,
    isCanEditCollectionFlow,
    isLoading,
    generateAndOpenPDFInNewTab,
    isGeneratingPDF,
    isDemoAccount,
  };
};
