import { BlocksComponent } from '@ballerine/blocks';
import { useDefaultBlocksLogic } from '@/lib/blocks/variants/DefaultBlocks/hooks/useDefaultBlocksLogic/useDefaultBlocksLogic';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { KycBlock } from '@/lib/blocks/components/KycBlock/KycBlock';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

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
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {Array.isArray(kybChildWorkflows) &&
        !!kybChildWorkflows?.length &&
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
        !!kycChildWorkflows?.length &&
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
