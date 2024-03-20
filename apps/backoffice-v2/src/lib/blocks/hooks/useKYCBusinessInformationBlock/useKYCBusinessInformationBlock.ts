import { useManualReviewBlocksLogic } from '@/lib/blocks/variants/ManualReviewBlocks/hooks/useManualReviewBlocksLogic/useManualReviewBlocksLogic';

export const useKYCBusinessInformationBlock = () => {
  const { businessInformationBlock } = useManualReviewBlocksLogic();

  return businessInformationBlock;
};
