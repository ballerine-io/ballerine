import { ManualReviewBlocks } from '@/lib/blocks/variants/ManualReviewBlocks/ManualReviewBlocks';
import { KybExampleBlocks } from '@/lib/blocks/variants/KybExampleBlocks/KybExampleBlocks';
import { DefaultBlocks } from '@/lib/blocks/variants/DefaultBlocks/DefaultBlocks';
import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { WorkflowDefinitionVariant } from '@ballerine/common';

export const BlocksVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  const isKybExample =
    workflowDefinition?.version >= 0 &&
    workflowDefinition?.variant === WorkflowDefinitionVariant.KYB &&
    workflowDefinition?.config?.isExample;
  const isManualReview =
    workflowDefinition?.version >= 0 &&
    workflowDefinition?.variant === WorkflowDefinitionVariant.MANUAL_REVIEW &&
    workflowDefinition?.config?.isLegacyReject;

  if (isKybExample) {
    return <KybExampleBlocks />;
  }

  if (isManualReview) {
    return <ManualReviewBlocks />;
  }

  return <DefaultBlocks />;
};
