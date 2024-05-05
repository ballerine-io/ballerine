import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useManualReviewBlocksLogic } from '@/lib/blocks/variants/ManualReviewBlocks/hooks/useManualReviewBlocksLogic/useManualReviewBlocksLogic';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { BlocksComponent } from '@ballerine/blocks';
import { DEFAULT_PROCESS_TRACKER_PROCESSES } from '@/common/components/molecules/ProcessTracker/constants';

export const ManualReviewBlocks = () => {
  const { blocks, isLoading } = useManualReviewBlocksLogic();
  const { data: workflow } = useCurrentCaseQuery();
  const plugins = useCasePlugins({ workflow: workflow as TWorkflowById });

  return (
    <>
      {workflow?.workflowDefinition?.config?.isCaseOverviewEnabled && (
        <ProcessTracker
          workflow={workflow}
          plugins={plugins}
          processes={DEFAULT_PROCESS_TRACKER_PROCESSES}
        />
      )}
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {!isLoading && !blocks?.length && <NoBlocks />}
    </>
  );
};
