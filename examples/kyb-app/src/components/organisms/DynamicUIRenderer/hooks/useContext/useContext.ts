import { AnyObject } from '@ballerine/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useContext = <TContext extends AnyObject>(context: TContext) => {
  const [contextState, setState] = useState(context || {});
  const contextRef = useRef<TContext>(context);

  const updateContext = useCallback(
    (context: TContext) => {
      setState(context);

      contextRef.current = context;

      return contextRef.current;
    },
    [contextRef],
  );

  const getContext = useCallback(() => contextRef.current, [contextRef]);

  useEffect(() => {
    updateContext(context);
  }, [context, updateContext]);

  return {
    context: contextState,
    updateContext,
    getContext,
  };
};
