import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  checkIsAmlVariant,
  checkIsOngoingVariant,
  checkIsWebsiteMonitoringVariant,
} from '@/lib/blocks/variants/variant-checkers';
import { DefaultActions } from '@/pages/Entity/components/Case/actions-variants/DefaultActions/DefaultActions';
import { WebsiteMonitoringActions } from '@/pages/Entity/components/Case/actions-variants/WebsiteMonitoringCaseActions/WebsiteMonitoringCaseActions';
import { FunctionComponent } from 'react';

export const ActionsVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  const noActions =
    checkIsOngoingVariant(workflowDefinition) || checkIsAmlVariant(workflowDefinition);
  const isWebsiteMontiroingVariant = checkIsWebsiteMonitoringVariant(workflowDefinition);

  if (noActions) {
    return null;
  }

  if (isWebsiteMontiroingVariant) {
    return <WebsiteMonitoringActions />;
  }

  return <DefaultActions />;
};
