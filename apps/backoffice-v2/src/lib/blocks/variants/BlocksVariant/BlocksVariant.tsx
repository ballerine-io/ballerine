import { TWorkflowById } from '@/domains/workflows/fetchers';
import { DefaultBlocks } from '@/lib/blocks/variants/DefaultBlocks/DefaultBlocks';
import { KybExampleBlocks } from '@/lib/blocks/variants/KybExampleBlocks/KybExampleBlocks';
import { ManualReviewBlocks } from '@/lib/blocks/variants/ManualReviewBlocks/ManualReviewBlocks';
import { OngoingBlocks } from '@/lib/blocks/variants/OngoingBlocks/OngoingBlocks';
import { PDFRevisionBlocks } from '@/lib/blocks/variants/PDFRevisionBlocks';
import {
  checkIfWebsiteMonitoringVariant,
  checkIsKybExampleVariant,
  checkIsManualReviewVariant,
  checkIsOngoingVariant,
} from '@/lib/blocks/variants/variant-checkers';
import { FunctionComponent } from 'react';

export const BlocksVariant: FunctionComponent<{
  workflowDefinition: Pick<
    TWorkflowById['workflowDefinition'],
    'variant' | 'config' | 'version' | 'name'
  >;
}> = ({ workflowDefinition }) => {
  const isKybExampleVariant = checkIsKybExampleVariant(workflowDefinition);
  const isManualReviewVariant = checkIsManualReviewVariant(workflowDefinition);
  const isPDFReviewVariant = checkIfWebsiteMonitoringVariant(workflowDefinition);
  const isOngoingVariant = checkIsOngoingVariant(workflowDefinition);

  if (isPDFReviewVariant) {
    return <PDFRevisionBlocks />;
  }

  if (isKybExampleVariant) {
    return <KybExampleBlocks />;
  }

  if (isManualReviewVariant) {
    return <ManualReviewBlocks />;
  }

  if (isOngoingVariant) {
    return <OngoingBlocks />;
  }

  return <DefaultBlocks />;
};
