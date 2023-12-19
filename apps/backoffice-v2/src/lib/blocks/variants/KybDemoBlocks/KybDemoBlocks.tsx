import { BlocksComponent } from '@ballerine/blocks';
import { useKybDemoBlocksLogic } from '@/lib/blocks/variants/KybDemoBlocks/hooks/useKybDemoBlocksLogic/useKybDemoBlocksLogic';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const KybDemoBlocks = () => {
  const {
    blocks,
    kybChildWorkflows,
    workflowId,
    parentMachine,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    isLoading,
  } = useKybDemoBlocksLogic();

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
      {!isLoading && !blocks?.length && !kybChildWorkflows?.length && <NoBlocks />}
    </>
  );
};
