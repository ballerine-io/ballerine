import { useRef, MutableRefObject, useLayoutEffect } from 'react';

export const useRefValue = <TValue>(value: TValue): MutableRefObject<TValue> => {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  }, [value, ref]);

  return ref;
};
