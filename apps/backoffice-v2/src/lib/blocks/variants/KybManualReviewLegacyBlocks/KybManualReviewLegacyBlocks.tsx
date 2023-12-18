import { BlocksComponent } from '@/lib/blocks/components/BlocksComponent/BlocksComponent';
import { useKybManualReviewLegacyBlocksLogic } from '@/lib/blocks/variants/KybManualReviewLegacyBlocks/hooks/useKybManualReviewLegacyBlocksLogic/useKybManualReviewLegacyBlocksLogic';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';

export const KybManualReviewLegacyBlocks = () => {
  const { blocks, isLoading } = useKybManualReviewLegacyBlocksLogic();

  return (
    <>
      <BlocksComponent blocks={blocks} />
      {!isLoading && !blocks?.length && <NoBlocks />}
    </>
  );
};
