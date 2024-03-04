import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { checkIsOngoingVariant } from '@/lib/blocks/variants/variant-checkers';
import { DefaultActions } from '@/pages/Entity/components/Case/actions-variants/DefaultActions/DefaultActions';
import { OngoingActions } from '@/pages/Entity/components/Case/actions-variants/OngoingActions/OngoingActions';

export const ActionsVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  const isOngoingVariant = checkIsOngoingVariant(workflowDefinition);

  if (isOngoingVariant) {
    return <OngoingActions />;
  }

  return <DefaultActions />;
};
