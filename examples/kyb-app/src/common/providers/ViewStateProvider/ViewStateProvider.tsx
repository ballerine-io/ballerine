import { useMachine } from '@xstate/react';
import { stateContext } from './state.context';
import { useCallback, useMemo } from 'react';
import { AnyChildren, AnyObject } from '@ballerine/ui';
import {
  InitialContext,
  SchemaBase,
  ViewStateContext,
  ViewStateSchema,
} from '@app/common/providers/ViewStateProvider/types';
import { createStateMachine } from '@app/common/providers/ViewStateProvider/helpers/createStateMachine';
import { ViewResolver } from '@app/common/providers/ViewStateProvider/components/ViewResolver';
import debounce from 'lodash/debounce';

const { Provider } = stateContext;
interface Props<T extends SchemaBase> {
  viewSchema: ViewStateSchema;
  initialContext?: InitialContext<T> | null;
  children: AnyChildren;
}

export const ViewStateProvider = ({ children, viewSchema, initialContext }: Props<any>) => {
  const stateMachine = useMemo(
    () =>
      createStateMachine<AnyObject>({
        ...viewSchema,
        context: initialContext || (viewSchema.context as object),
        initial: initialContext ? initialContext.state : viewSchema.initial,
      }),
    [viewSchema, initialContext],
  );

  const [machine, _send] = useMachine(stateMachine);

  const next = useCallback(() => {
    _send('NEXT');
  }, [_send]);

  const prev = useCallback(() => {
    _send('PREV');
  }, [_send]);

  const update = useCallback(
    (payload: object, shared?: object) => {
      _send('SAVE_DATA', { payload, shared });
    },
    [_send],
  );

  const updateAsync = useMemo(() => debounce(update, 1000), [update]);

  const saveAndPerformTransition = useCallback(
    (payload: object, shared?: object) => {
      update(payload, shared);
      next();
    },
    [update, next],
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

  //@ts-ignore
  //This is  temporary hack to force rerender of subscribed components on change
  const ctx_ = { ...machine.context };
  const context = useMemo(() => {
    const ctx: ViewStateContext<AnyObject> = {
      state: machine.value as string,
      stateData: stateContext,
      context: ctx_ as AnyObject,
      updateAsync,
      update,
      saveAndPerformTransition,
      next,
      prev,
      send,
    };

    return ctx;
  }, [
    machine.value,
    ctx_,
    stateContext,
    updateAsync,
    update,
    next,
    prev,
    send,
    saveAndPerformTransition,
  ]);

  return <Provider value={context}>{children}</Provider>;
};

ViewStateProvider.ViewResolver = ViewResolver;
