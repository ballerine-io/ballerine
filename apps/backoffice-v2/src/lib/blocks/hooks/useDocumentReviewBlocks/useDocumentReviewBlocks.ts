import { useManualReviewBlocksLogic } from '@/lib/blocks/variants/ManualReviewBlocks/hooks/useManualReviewBlocksLogic/useManualReviewBlocksLogic';
import { useCaseOverviewBlock } from '@/lib/blocks/hooks/useCaseOverviewBlock/useCaseOverviewBlock';

export const useDocumentReviewBlocks = () => {
  const { blocks } = useManualReviewBlocksLogic();
  const caseOverviewBlock = useCaseOverviewBlock();

  return [...caseOverviewBlock, ...blocks];
};
