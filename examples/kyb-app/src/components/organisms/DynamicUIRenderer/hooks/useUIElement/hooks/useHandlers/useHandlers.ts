import { isEventRule } from '@app/components/organisms/DynamicUIRenderer/helpers/is-event-rule';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUIRenderer/hooks/useDynamicUIContext';
import { Action } from '@app/components/organisms/DynamicUIRenderer/temp';
import { useMemo } from 'react';

export interface ElementHandlers {
  onClick: React.MouseEventHandler<any> | undefined;
  onChange: React.ChangeEventHandler<any> | undefined;
}

export const useHandlers = (elementName: string, actions: Action[]) => {
  const { dispatchActions, updateContext, getContext } = useDynamicUIContext();
  const scopedActions = useMemo(() => {
    const scopedActions = actions.filter(action => {
      return Boolean(
        action.invokeOn.find(rule => {
          if (!isEventRule(rule)) return false;

          return rule.value.uiElementName === elementName;
        }),
      );
    });

    return scopedActions;
  }, [elementName, actions]);

  const handlers: ElementHandlers = useMemo(() => {
    const onClickActions = scopedActions.filter(action =>
      action.invokeOn.find(rule => (isEventRule(rule) ? rule.value.event === 'onClick' : false)),
    );
    const onChangeActions = scopedActions.filter(action =>
      action.invokeOn.find(rule => (isEventRule(rule) ? rule.value.event === 'onChange' : false)),
    );

    return {
      onClick: onClickActions
        ? () => {
            dispatchActions(onClickActions);
          }
        : undefined,
      onChange: event => {
        //@ts-ignore
        updateContext({ ...getContext(), [event.target.name as string]: event.target.value });

        setTimeout(() => {
          dispatchActions(onChangeActions);
        });
      },
    };
  }, [scopedActions, dispatchActions, getContext, updateContext]);

  return {
    handlers,
  };
};
