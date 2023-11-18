import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useContext = <TContext extends AnyObject>(
  context: TContext,
  onChange: (caller: UIElement<any>, value: unknown) => void,
) => {
  const [contextState, setState] = useState(context || {});
  const contextRef = useRef<TContext>(context);

  const updateContext = useCallback(
    (caller: UIElement<any>, value: unknown, context: TContext) => {
      setState(context);

      contextRef.current = context;

      onChange(caller, value);

      return contextRef.current;
    },
    [contextRef, onChange],
  );

  const getContext = useCallback(() => contextRef.current, [contextRef]);

  useEffect(() => {
    setState(context);
  }, [context]);

  return {
    context: contextState,
    updateContext,
    setContext: setState,
    getContext,
  };
};
