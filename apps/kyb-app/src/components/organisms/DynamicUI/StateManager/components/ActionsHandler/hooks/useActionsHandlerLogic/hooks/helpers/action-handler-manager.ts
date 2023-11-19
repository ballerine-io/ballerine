import { ActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';

export class ActionHandlerManager {
  constructor(private readonly actionHandlers: ActionHandler[]) {}

  getActionHandler = (actionName: string): ActionHandler | null => {
    return this.actionHandlers.find(action => action.ACTION_TYPE === actionName) || null;
  };
}
