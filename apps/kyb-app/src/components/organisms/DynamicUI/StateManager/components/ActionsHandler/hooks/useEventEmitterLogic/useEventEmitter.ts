import { useActionsHandlerContext } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useActionsHandlerContext';
import { getDispatchableActions } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/helpers/getDispatchableActions';
import { getTriggeredActions } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/helpers/getTriggeredActions';
import { UIEventType } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/types';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useCallback } from 'react';

export const useEventEmitterLogic = (elementDefinition: UIElement<AnyObject>) => {
  const { actions, dispatchAction } = useActionsHandlerContext();
  const { stateApi } = useStateManagerContext();
  const { state } = useDynamicUIContext();

  const emitEvent = useCallback(
    (type: UIEventType) => {
      const triggeredActions = getTriggeredActions(
        { type, elementName: elementDefinition.name },
        actions,
      );

      const dispatchableActions = getDispatchableActions(
        stateApi.getContext(),
        triggeredActions,
        elementDefinition,
        state,
      );

      dispatchableActions.forEach(action => dispatchAction(action));
    },
    [elementDefinition, actions, stateApi, state, dispatchAction],
  );

  return emitEvent;
};
