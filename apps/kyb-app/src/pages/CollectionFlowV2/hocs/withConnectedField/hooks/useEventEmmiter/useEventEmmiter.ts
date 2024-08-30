import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useActionsHandlerContext } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler';
import { getTriggeredActions } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/helpers/getTriggeredActions';
import { useActionDispatcher } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/hooks/useActionDispatcher';
import { UIEventType } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/types';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { getActionsToDispatch } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useEventEmmiter/helpers/getActionsToDispatch';
import { useCallback } from 'react';

export const useEventEmmitter = (uiElement: UIElement) => {
  const { actions, dispatchAction } = useActionsHandlerContext();
  const { stateApi } = useStateManagerContext();
  const { state } = useDynamicUIContext();
  const { getDispatch } = useActionDispatcher(actions, dispatchAction);
  const { currentPage } = usePageResolverContext();

  const emitEvent = useCallback(
    (type: UIEventType) => {
      const triggeredActions = getTriggeredActions(
        { type, elementName: uiElement.getId() },
        actions,
      );

      const actionsToDispatch = getActionsToDispatch(stateApi.getContext(), triggeredActions);

      actionsToDispatch.forEach(action => {
        const dispatch = getDispatch(action);
        if (!dispatch) {
          console.warn(`Action dispatcher not found for ${JSON.stringify(action)}`);
          return;
        }

        dispatch(action);
      });
    },
    [actions, stateApi, state, currentPage, getDispatch],
  );

  return emitEvent;
};
