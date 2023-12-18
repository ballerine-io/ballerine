import { ManualReviewBlocks } from '@/lib/blocks/variants/ManualReviewBlocks/ManualReviewBlocks';
import { KybDemoBlocks } from '@/lib/blocks/variants/KybDemoBlocks/KybDemoBlocks';
import { DefaultBlocks } from '@/lib/blocks/variants/DefaultBlocks/DefaultBlocks';
import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { WorkflowVariant } from '@ballerine/common';

export const BlocksVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  if (
    workflowDefinition?.version >= 0 &&
    workflowDefinition?.variant === WorkflowVariant.KYB &&
    workflowDefinition?.config?.isDemo
  ) {
    return <KybDemoBlocks />;
  }

  if (
    workflowDefinition?.version >= 0 &&
    workflowDefinition?.variant === WorkflowVariant.MANUAL_REVIEW &&
    workflowDefinition?.config?.isLegacyReject
  ) {
    return <ManualReviewBlocks />;
  }

  return <DefaultBlocks />;
};
