import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useKybExampleBlocksLogic } from '@/lib/blocks/variants/KybExampleBlocks/hooks/useKybExampleBlocksLogic/useKybExampleBlocksLogic';
import { BlocksComponent } from '@ballerine/blocks';
import { DEFAULT_PROCESS_TRACKER_PROCESSES } from '@/common/components/molecules/ProcessTracker/constants';
import { CaseOverview } from '@/pages/Entity/components/Case/components/CaseOverview/CaseOverview';

export const KybExampleBlocks = () => {
  const {
    blocks,
    kybChildWorkflows,
    workflowId,
    parentMachine,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    isLoading,
  } = useKybExampleBlocksLogic();

  return (
    <>
      <CaseOverview processes={DEFAULT_PROCESS_TRACKER_PROCESSES} />
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
