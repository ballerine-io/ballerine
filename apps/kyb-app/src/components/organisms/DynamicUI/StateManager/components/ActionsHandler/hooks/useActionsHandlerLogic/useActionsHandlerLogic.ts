import { ActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';
import { ApiActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/api.handler';
import { EventDispatcherHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/event-dispatcher.handler';
import { PluginRunnerHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/plugin-runner.handler';
import { ValueApplyHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/value-apply.handler';
import { useActionsProcessingLogic } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useActionsHandlerLogic/hooks/useActionsProcessingLogic';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@/domains/collection-flow';
import { useCallback } from 'react';

const defaultActionHandlers: ActionHandler[] = [
  new ApiActionHandler(),
  new EventDispatcherHandler(),
  new PluginRunnerHandler(),
  new ValueApplyHandler(),
];

export const useActionsHandlerLogic = (
  stateApi: StateMachineAPI,
  actionHandlers = defaultActionHandlers,
) => {
  const { pushAction } = useActionsProcessingLogic(stateApi, actionHandlers);

  const dispatchAction = useCallback(
    (action: Action) => {
      pushAction(action);
    },
    [pushAction],
  );

  return {
    dispatchAction,
  };
};
