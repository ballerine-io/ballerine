import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useManualReviewBlocksLogic } from '@/lib/blocks/variants/ManualReviewBlocks/hooks/useManualReviewBlocksLogic/useManualReviewBlocksLogic';
import { BlocksComponent } from '@ballerine/blocks';
import { DEFAULT_PROCESS_TRACKER_PROCESSES } from '@/common/components/molecules/ProcessTracker/constants';
import { CaseOverview } from '@/pages/Entity/components/Case/components/CaseOverview/CaseOverview';
import { CaseTimeline } from '@/lib/blocks/components/CaseTimeline/CaseTimeline';
import { useParams } from 'react-router-dom';

export const ManualReviewBlocks = () => {
  const { blocks, isLoading } = useManualReviewBlocksLogic();
  const { entityId: workflowId } = useParams();

  return (
    <>
      <CaseOverview processes={DEFAULT_PROCESS_TRACKER_PROCESSES} />
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {!isLoading && !blocks?.length && <NoBlocks />}
      {workflowId && (
        <details className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 select-none">
            📋 Audit Trail
          </summary>
          <div className="mt-3">
            <CaseTimeline workflowId={workflowId} />
          </div>
        </details>
      )}
    </>
  );
};
