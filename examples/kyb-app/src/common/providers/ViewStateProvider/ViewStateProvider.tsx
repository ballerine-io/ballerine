import { useMachine } from '@xstate/react';
import { stateContext } from './state.context';
import { useCallback, useMemo } from 'react';
import { AnyChildren, AnyObject } from '@ballerine/ui';
import { ViewStateContext, ViewStateSchema } from '@app/common/providers/ViewStateProvider/types';
import { createStateMachine } from '@app/common/providers/ViewStateProvider/helpers/createStateMachine';
import { ViewResolver } from '@app/common/providers/ViewStateProvider/components/ViewResolver';
const { Provider } = stateContext;

interface Props {
  viewSchema: ViewStateSchema;
  children: AnyChildren;
}

export const ViewStateProvider = ({ children, viewSchema }: Props) => {
  const [machine, _send, service] = useMachine(createStateMachine<AnyObject>(viewSchema));

  const next = useCallback(() => {
    _send('NEXT');
  }, [_send]);

  const prev = useCallback(() => {
    _send('PREV');
  }, [_send]);

  const saveAndPerformTransition = useCallback(
    (payload: object, shared?: object) => {
      _send('SAVE_DATA', { payload, shared });
      next();
    },
    [_send, next],
  );

  const send = useCallback(
    (type: string, payload?: object) => {
      _send(type, { payload });
    },
    [_send],
  );

  const stateContext = useMemo((): object => {
    if (typeof machine.value === 'string' && typeof machine.context === 'object') {
      return ((machine.context as object)[machine.value] as object) || {};
    }

    return {};
  }, [machine.context, machine.value]);

  const context = useMemo(() => {
    const ctx: ViewStateContext<AnyObject> = {
      state: machine.value as string,
      stateData: stateContext,
      context: machine.context as AnyObject,
      saveAndPerformTransition,
      next,
      prev,
      send,
    };

    return ctx;
  }, [machine.value, machine.context, stateContext, next, prev, send, saveAndPerformTransition]);

  return <Provider value={context}>{children}</Provider>;
};

ViewStateProvider.ViewResolver = ViewResolver;
