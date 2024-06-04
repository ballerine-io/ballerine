import { TWorkflowById } from '@/domains/workflows/fetchers';
import { DefaultBlocks } from '@/lib/blocks/variants/DefaultBlocks/DefaultBlocks';
import { KybExampleBlocks } from '@/lib/blocks/variants/KybExampleBlocks/KybExampleBlocks';
import { ManualReviewBlocks } from '@/lib/blocks/variants/ManualReviewBlocks/ManualReviewBlocks';
import { OngoingBlocks } from '@/lib/blocks/variants/OngoingBlocks/OngoingBlocks';
import { WebsiteMonitoringBlocks } from '@/lib/blocks/variants/WebsiteMonitoringBlocks';
import {
  checkIsAmlVariant,
  checkIsKybExampleVariant,
  checkIsManualReviewVariant,
  checkIsOngoingVariant,
  checkIsWebsiteMonitoringVariant,
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
  const isWebsiteMonitoringVariant = checkIsWebsiteMonitoringVariant(workflowDefinition);
  const isOngoingVariant =
    checkIsOngoingVariant(workflowDefinition) || checkIsAmlVariant(workflowDefinition);

  if (isWebsiteMonitoringVariant) {
    return <WebsiteMonitoringBlocks />;
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
