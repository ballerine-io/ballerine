import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useActionsHandlerContext } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler';
import { getTriggeredActions } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/helpers/getTriggeredActions';
import { useActionDispatcher } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/hooks/useActionDispatcher';
import { UIEventType } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useEventEmitterLogic/types';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElementV2 } from '@/components/providers/Validator/types';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/v2/useUIElement';
import { useCallback } from 'react';

export const useEventEmmitter = (definition: UIElementV2, stack?: number[]) => {
  const { actions, dispatchAction } = useActionsHandlerContext();
  const { stateApi, payload } = useStateManagerContext();
  const { state } = useDynamicUIContext();
  const { getDispatch } = useActionDispatcher(actions, dispatchAction);
  const { currentPage } = usePageResolverContext();
  const uiElement = useUIElement(definition, payload, stack);

  const emitEvent = useCallback(
    (type: UIEventType) => {
      const triggeredActions = getTriggeredActions(
        { type, elementName: uiElement.getId() },
        actions,
      );

      const dispatchableActions = getDispatchableActions(
        stateApi.getContext(),
        triggeredActions,
        elementDefinition,
        state,
        currentPage!,
      );

      dispatchableActions.forEach(action => {
        const dispatch = getDispatch(action);
        if (!dispatch) {
          console.warn(`Action dispatcher not found for ${JSON.stringify(action)}`);
          return;
        }

        dispatch(action);
      });
    },
    [elementDefinition, actions, stateApi, state, currentPage, getDispatch],
  );

  return emitEvent;
};
