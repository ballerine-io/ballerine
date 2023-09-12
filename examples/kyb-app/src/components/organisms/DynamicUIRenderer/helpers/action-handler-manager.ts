import { ActionHandler } from '@app/components/organisms/DynamicUIRenderer/action-handlers/action-handler.abstract';

export class ActionHandlerManager {
  constructor(private readonly actionHandlers: ActionHandler[]) {}

  getActionHandler = (actionName: string): ActionHandler | null => {
    return this.actionHandlers.find(action => action.ACTION_TYPE === actionName) || null;
  };
}
