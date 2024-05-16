import { useManualReviewBlocksLogic } from '@/lib/blocks/variants/ManualReviewBlocks/hooks/useManualReviewBlocksLogic/useManualReviewBlocksLogic';

export const useDocumentReviewBlocks = () => {
  const { blocks } = useManualReviewBlocksLogic();

  return blocks;
};
