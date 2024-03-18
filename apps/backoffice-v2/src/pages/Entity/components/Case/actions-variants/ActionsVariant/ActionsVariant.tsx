import { TWorkflowById } from '@/domains/workflows/fetchers';
import {
  checkIfWebsiteMonitoringVariant,
  checkIsOngoingVariant,
} from '@/lib/blocks/variants/variant-checkers';
import { DefaultActions } from '@/pages/Entity/components/Case/actions-variants/DefaultActions/DefaultActions';
import { OngoingActions } from '@/pages/Entity/components/Case/actions-variants/OngoingActions/OngoingActions';
import { WebsiteMonitoringCaseActions } from '@/pages/Entity/components/Case/actions-variants/WebsiteMonitoringCaseActions/WebsiteMonitoringCaseActions';
import { FunctionComponent } from 'react';

export const ActionsVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  const isOngoingVariant = checkIsOngoingVariant(workflowDefinition);
  const isWebsiteMontiroingVariant = checkIfWebsiteMonitoringVariant(workflowDefinition);

  if (isOngoingVariant) {
    return <OngoingActions />;
  }

  if (isWebsiteMontiroingVariant) {
    return <WebsiteMonitoringCaseActions />;
  }

  return <DefaultActions />;
};
