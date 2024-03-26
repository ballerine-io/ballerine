import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { ChildDocumentBlocks } from '@/lib/blocks/components/ChildDocumentBlocks/ChildDocumentBlocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useKybExampleBlocksLogic } from '@/lib/blocks/variants/KybExampleBlocks/hooks/useKybExampleBlocksLogic/useKybExampleBlocksLogic';
import { useCurrentCase } from '@/pages/Entity/hooks/useCurrentCase/useCurrentCase';
import { BlocksComponent } from '@ballerine/blocks';

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
  const { workflow, plugins } = useCurrentCase();

  return (
    <>
      {workflow?.workflowDefinition?.config?.isCaseOverviewEnabled && (
        <ProcessTracker
          tags={workflow?.tags ?? []}
          plugins={plugins}
          context={workflow?.context}
          childWorkflows={workflow?.childWorkflows ?? []}
        />
      )}
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
