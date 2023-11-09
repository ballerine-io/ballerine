import { ActionDispatcher } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/types';
import { Action } from '@app/domains/collection-flow';
import { useRefValue } from '@app/hooks/useRefValue';
import _debounce from 'lodash/debounce';
import { useCallback, useMemo } from 'react';

export type ActionDispatchers = Map<Action, ActionDispatcher>;

export const useActionDispatcher = (actions: Action[], dispatch: (action: Action) => void) => {
  const dispatchRef = useRefValue(dispatch);

  const createDispatcher = useCallback(
    (action: Action) => {
      const { debounce } = action.params || {};

      if (debounce) {
        return _debounce(dispatchRef.current, debounce);
      }

      return dispatchRef.current;
    },
    [dispatchRef],
  );

  const dispatchers: ActionDispatchers = useMemo(
    () =>
      actions.reduce((map, action) => {
        map.set(action, createDispatcher(action));

        return map;
      }, new Map() as ActionDispatchers),
    [createDispatcher, actions],
  );

  const getDispatch = useCallback(
    (action: Action) => {
      return dispatchers.get(action) || null;
    },
    [dispatchers],
  );

  return {
    dispatchers,
    getDispatch,
  };
};
