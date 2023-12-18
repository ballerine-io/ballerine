import { BlocksComponent } from '@/lib/blocks/components/BlocksComponent/BlocksComponent';
import { useManualReviewBlocksLogic } from '@/lib/blocks/variants/ManualReviewBlocks/hooks/useManualReviewBlocksLogic/useManualReviewBlocksLogic';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';

export const ManualReviewBlocks = () => {
  const { blocks, isLoading } = useManualReviewBlocksLogic();

  return (
    <>
      <BlocksComponent blocks={blocks} />
      {!isLoading && !blocks?.length && <NoBlocks />}
    </>
  );
};
