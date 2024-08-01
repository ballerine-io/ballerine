import { useEventEmitterLogic } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { UIElement as IUIElement } from '@/domains/collection-flow';
import set from 'lodash/set';
import { useCallback } from 'react';

export const useUIElementHandlers = (uiElement: UIElement, definition: IUIElement) => {
  const emitEvent = useEventEmitterLogic(definition);
  const { stateApi } = useStateManagerContext();
  const { setContext, getContext } = stateApi;

  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<any>) => {
      const context = getContext();

      //@ts-ignore
      set(context, uiElement.getValueDestination(), event.target.value);
      setContext(context);
      emitEvent('onChange');
    },
    [uiElement, getContext, setContext, emitEvent],
  );

  const onClickHandler = useCallback(() => {
    emitEvent('onClick');
  }, [emitEvent]);

  return {
    onChangeHandler,
    onClickHandler,
  };
};
