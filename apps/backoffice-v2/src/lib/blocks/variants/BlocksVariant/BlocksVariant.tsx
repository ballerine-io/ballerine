import { ManualReviewBlocks } from '@/lib/blocks/variants/ManualReviewBlocks/ManualReviewBlocks';
import { KybDemoBlocks } from '@/lib/blocks/variants/KybDemoBlocks/KybDemoBlocks';
import { DefaultBlocks } from '@/lib/blocks/variants/DefaultBlocks/DefaultBlocks';
import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { WorkflowDefinitionVariant } from '@ballerine/common';

export const BlocksVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  const isKybDemo =
    workflowDefinition?.version >= 0 &&
    workflowDefinition?.variant === WorkflowDefinitionVariant.KYB &&
    workflowDefinition?.config?.isDemo;
  const isManualReview =
    workflowDefinition?.version >= 0 &&
    workflowDefinition?.variant === WorkflowDefinitionVariant.MANUAL_REVIEW &&
    workflowDefinition?.config?.isLegacyReject;

  if (isKybDemo) {
    return <KybDemoBlocks />;
  }

  if (isManualReview) {
    return <ManualReviewBlocks />;
  }

  return <DefaultBlocks />;
};
