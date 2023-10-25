import { isEventRule } from '@app/components/organisms/DynamicElements/helpers/is-event-rule';
import { useDynamicUIContext } from '@app/components/organisms/DynamicElements/hooks/useDynamicUIContext';
import { Action, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export interface ElementHandlers {
  onClick: React.MouseEventHandler<any> | undefined;
  onChange: React.ChangeEventHandler<any> | undefined;
}

export const useHandlers = (element: UIElement<AnyObject>, actions: Action[]) => {
  const { dispatchActions, updateContext, getContext } = useDynamicUIContext();
  const scopedActions = useMemo(() => {
    const scopedActions = actions.filter(action => {
      return Boolean(
        action.dispatchOn.find(rule => {
          if (isEventRule(rule)) {
            return rule.value.uiElementName === element.name;
          }
          return false;
        }),
      );
    });

    return scopedActions;
  }, [element.name, actions]);

  const handlers: ElementHandlers = useMemo(() => {
    const onClickActions = scopedActions.filter(action =>
      action.dispatchOn.find(rule => (isEventRule(rule) ? rule.value.event === 'onClick' : false)),
    );
    const onChangeActions = scopedActions.filter(action =>
      action.dispatchOn.find(rule => (isEventRule(rule) ? rule.value.event === 'onChange' : false)),
    );

    return {
      onClick: onClickActions
        ? () => {
            dispatchActions(onClickActions);
          }
        : undefined,
      onChange: event => {
        //@ts-ignore
        updateContext(element, event.target.value as unknown, getContext());

        setTimeout(() => {
          if (!onChangeActions.length) return;
          dispatchActions(onChangeActions);
        });
      },
    };
  }, [scopedActions, element, dispatchActions, getContext, updateContext]);

  return {
    handlers,
  };
};
