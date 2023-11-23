import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { useCallback } from 'react';
import { Action } from '@/domains/collection-flow';
import { ApiActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/api.handler';
import { EventDispatcherHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/event-dispatcher.handler';
import { PluginRunnerHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/plugin-runner.handler';
import { useActionsProcessingLogic } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useActionsHandlerLogic/hooks/useActionsProcessingLogic';
import { ActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';

const defaultActionHandlers: ActionHandler[] = [
  new ApiActionHandler(),
  new EventDispatcherHandler(),
  new PluginRunnerHandler(),
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
