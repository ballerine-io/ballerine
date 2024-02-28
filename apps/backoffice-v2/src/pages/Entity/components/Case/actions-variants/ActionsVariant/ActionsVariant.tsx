import { FunctionComponent } from 'react';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { checkIsOnGoingVariant } from '@/lib/blocks/variants/variant-checkers';
import { DefaultActions } from '@/pages/Entity/components/Case/actions-variants/DefaultActions/DefaultActions';
import { OnGoingActions } from '@/pages/Entity/components/Case/actions-variants/OnGoingActions/OnGoingActions';

export const ActionsVariant: FunctionComponent<{
  workflowDefinition: Pick<TWorkflowById['workflowDefinition'], 'variant' | 'config' | 'version'>;
}> = ({ workflowDefinition }) => {
  const isOnGoingVariant = checkIsOnGoingVariant(workflowDefinition);

  if (isOnGoingVariant) {
    return <OnGoingActions />;
  }

  return <DefaultActions />;
};
