import { useCurrentPageElement } from '@app/components/organisms/DynamicUI/PageResolver/hooks/useCurrentPageElement';
import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { useActionsHandlerContext } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useActionsHandlerContext';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/rule-engines/json-logic.rule-engine';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';
import { Rule } from '@app/domains/collection-flow';
import { Button } from '@ballerine/ui';
import { useCallback } from 'react';

export const ButtonUIElement: UIElementComponent<{ label: string }> = ({ definition }) => {
  const { dispatchAction } = useActionsHandlerContext();
  const { currentPage } = usePageResolverContext();
  const { stateApi } = useStateManagerContext();

  const handleClick = useCallback(() => {
    currentPage.actions.forEach(action => {
      const manager = new EngineManager([new JsonLogicRuleEngine()]);
      if (true) {
        dispatchAction(action);
      }
    });
  }, [currentPage, dispatchAction, stateApi]);

  return (
    <Button variant="secondary" onClick={handleClick}>
      {definition.options.label || 'Click'}
    </Button>
  );
};
