import { BlocksComponent } from '@/lib/blocks/components/BlocksComponent/BlocksComponent';
import { useDefaultBlocksLogic } from '@/lib/blocks/variants/DefaultBlocks/hooks/useDefaultBlocksLogic/useDefaultBlocksLogic';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';

export const DefaultBlocks = () => {
  const {
    blocks,
    kybChildWorkflows,
    workflowId,
    parentMachine,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    kycChildWorkflows,
    isLoading,
  } = useDefaultBlocksLogic();

  return (
    <>
      <BlocksComponent blocks={blocks} />
      {Array.isArray(kybChildWorkflows) &&
        kybChildWorkflows?.length &&
        kybChildWorkflows?.map(childWorkflow => (
          <ChildDocumentBlocks
            parentWorkflowId={workflowId}
            childWorkflow={childWorkflow}
            parentMachine={parentMachine}
            key={childWorkflow?.id}
            onReuploadNeeded={onReuploadNeeded}
            isLoadingReuploadNeeded={isLoadingReuploadNeeded}
          />
        ))}
      {Array.isArray(kycChildWorkflows) &&
        kycChildWorkflows?.length > 0 &&
        kycChildWorkflows?.map(childWorkflow => (
          <KycBlock
            parentWorkflowId={workflowId}
            childWorkflow={childWorkflow}
            key={childWorkflow?.id}
          />
        ))}
      {!isLoading &&
        !blocks?.length &&
        !kybChildWorkflows?.length &&
        !kycChildWorkflows?.length && <NoBlocks />}
    </>
  );
};
