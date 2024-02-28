import { ManualReviewBlocks } from '@/lib/blocks/variants/ManualReviewBlocks/ManualReviewBlocks';
import { KybExampleBlocks } from '@/lib/blocks/variants/KybExampleBlocks/KybExampleBlocks';
import { DefaultBlocks } from '@/lib/blocks/variants/DefaultBlocks/DefaultBlocks';
import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  checkIsKybExampleVariant,
  checkIsManualReviewVariant,
  checkIsOnGoingVariant,
} from '@/lib/blocks/variants/variant-checkers';
import { OnGoingBlocks } from '@/lib/blocks/variants/OnGoingBlocks/OnGoingBlocks';

export const BlocksVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  const isKybExampleVariant = checkIsKybExampleVariant(workflowDefinition);
  const isManualReviewVariant = checkIsManualReviewVariant(workflowDefinition);
  const isOnGoingVariant = checkIsOnGoingVariant(workflowDefinition);

  if (isKybExampleVariant) {
    return <KybExampleBlocks />;
  }

  if (isManualReviewVariant) {
    return <ManualReviewBlocks />;
  }

  if (isOnGoingVariant) {
    return <OnGoingBlocks />;
  }

  return <DefaultBlocks />;
};
