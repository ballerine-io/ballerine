import { useActionsHandlerLogic } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/hooks/useActionsHandlerLogic';
import {
  ActionsHandlerContext,
  ActionsHandlerProps,
} from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/types';
import { useMemo } from 'react';
import { actionsHandlerContext } from './actions-handler.context';

const { Provider } = actionsHandlerContext;

export const ActionsHandler = ({ stateApi, children, actions }: ActionsHandlerProps) => {
  const { dispatchAction } = useActionsHandlerLogic(stateApi);

  const context: ActionsHandlerContext = useMemo(
    () => ({ dispatchAction, actions }),
    [actions, dispatchAction],
  );

  const child = useMemo(
    () => (typeof children === 'function' ? children(context) : children),
    [context, children],
  );

  return <Provider value={context}>{child}</Provider>;
};
