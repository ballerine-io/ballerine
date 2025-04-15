import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useCopyCollectionFlowLinkMutation } from './hooks/mutations/useCopyCollectionFlowLinkMutation/useCopyCollectionFlowLinkMutation';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const useCopyCollectionFlowLink = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { mutate: copyCollectionFlowLink, isLoading } = useCopyCollectionFlowLinkMutation({
    workflow: workflow as TWorkflowById,
  });

  return {
    copyCollectionFlowLink,
    isCopyingCollectionFlowLink: isLoading,
  };
};
