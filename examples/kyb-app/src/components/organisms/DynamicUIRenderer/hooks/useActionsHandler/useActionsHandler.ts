import { ActionHandler } from '@app/components/organisms/DynamicUIRenderer/action-handlers/action-handler.abstract';
import { ActionHandlerManager } from '@app/components/organisms/DynamicUIRenderer/helpers/action-handler-manager';
import { Action } from '@app/components/organisms/DynamicUIRenderer/temp';
import { useCallback, useEffect, useState } from 'react';

export const useActionsHandler = <TContext>(
  contextAccessor: () => TContext,
  onDone: (context: TContext) => void,
  actionHandlers: ActionHandler[],
) => {
  const [pendingActions, setPendingActions] = useState<Action[]>([]);
  const [isProcessingActions, setProcessingActions] = useState(false);

  const dispatchActions = useCallback((actions: Action[]) => {
    setPendingActions(actions);
  }, []);

  const processActions = useCallback(
    async (actions: Action[]) => {
      setProcessingActions(true);

      const actionHandlerManager = new ActionHandlerManager(actionHandlers);
      let context = contextAccessor();

      for (const action of actions) {
        const actionHandler = actionHandlerManager.getActionHandler(action.type);
        if (!actionHandler) throw new Error(`Action ${action.type} is not supported`);

        context = await actionHandler.run(context, action);
      }

      setPendingActions([]);
      setProcessingActions(false);
      onDone(context);
    },
    [actionHandlers, contextAccessor, onDone],
  );

  useEffect(() => {
    if (!pendingActions.length || isProcessingActions) return;

    void processActions(pendingActions);
  }, [pendingActions, isProcessingActions, processActions]);

  return {
    isProcessingActions,
    dispatchActions,
  };
};
