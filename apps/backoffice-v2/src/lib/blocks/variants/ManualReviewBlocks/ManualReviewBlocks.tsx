import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useManualReviewBlocksLogic } from '@/lib/blocks/variants/ManualReviewBlocks/hooks/useManualReviewBlocksLogic/useManualReviewBlocksLogic';
import { useCurrentCase } from '@/pages/Entity/hooks/useCurrentCase/useCurrentCase';
import { BlocksComponent } from '@ballerine/blocks';

export const ManualReviewBlocks = () => {
  const { blocks, isLoading } = useManualReviewBlocksLogic();
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
      {!isLoading && !blocks?.length && <NoBlocks />}
    </>
  );
};
