import { UIEvent } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/types';
import { Action } from '@/domains/collection-flow';

export const getTriggeredActions = (event: UIEvent, actions: Action[]): Action[] => {
  return actions.filter(action => {
    return (
      action.dispatchOn.uiEvents.length &&
      action.dispatchOn.uiEvents.some(
        actionEvent =>
          actionEvent.uiElementName === event.elementName &&
          actionEvent.event.toLocaleLowerCase() === event.type.toLocaleLowerCase(),
      )
    );
  });
};
